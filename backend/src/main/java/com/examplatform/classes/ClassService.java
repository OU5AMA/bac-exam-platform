package com.examplatform.classes;

import com.examplatform.common.exception.DuplicateResourceException;
import com.examplatform.common.exception.ResourceNotFoundException;
import com.examplatform.user.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ClassService {
    public static final int MAX_MEMBERS = 20;
    private static final int LEADERBOARD_LIMIT = 10;
    private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String LEADERBOARD_SQL = """
            SELECT c.id, c.name, c.join_code,
                   COUNT(DISTINCT cm.user_id) AS member_count,
                   COALESCE(SUM(up.score), 0) AS total_points
            FROM classes c
            LEFT JOIN class_members cm ON cm.class_id = c.id
            LEFT JOIN user_progress up ON up.user_id = cm.user_id
            GROUP BY c.id, c.name, c.join_code, c.created_at
            ORDER BY total_points DESC, c.created_at ASC, c.id ASC
            """;

    private final SchoolClassRepository schoolClassRepository;
    private final ClassMemberRepository classMemberRepository;
    private final JdbcTemplate jdbcTemplate;

    public ClassService(SchoolClassRepository schoolClassRepository,
                        ClassMemberRepository classMemberRepository,
                        JdbcTemplate jdbcTemplate) {
        this.schoolClassRepository = schoolClassRepository;
        this.classMemberRepository = classMemberRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public ClassSummaryResponse createClass(String name, User owner) {
        classMemberRepository.findByUser_Id(owner.getId()).ifPresent(existing -> {
            throw new DuplicateResourceException("You are already in a class. Leave it before creating a new one.");
        });

        String cleanName = name == null ? "" : name.trim();
        if (cleanName.isBlank() || cleanName.length() > 100) {
            throw new IllegalArgumentException("Class name must contain 1 to 100 characters.");
        }

        SchoolClass schoolClass = schoolClassRepository.save(new SchoolClass(cleanName, generateJoinCode(), owner));
        classMemberRepository.save(new ClassMember(schoolClass, owner));
        classMemberRepository.flush();
        return summaryFor(schoolClass.getId());
    }

    @Transactional
    public ClassSummaryResponse joinClass(String joinCode, User student) {
        String normalizedCode = normalizeJoinCode(joinCode);
        SchoolClass schoolClass = schoolClassRepository.findByJoinCodeForUpdate(normalizedCode)
                .orElseThrow(() -> new ResourceNotFoundException("That class code was not found."));

        Optional<ClassMember> existing = classMemberRepository.findByUser_Id(student.getId());
        if (existing.isPresent()) {
            if (existing.get().getSchoolClass().getId().equals(schoolClass.getId())) {
                return summaryFor(schoolClass.getId());
            }
            throw new DuplicateResourceException("You are already in another class.");
        }

        if (classMemberRepository.countBySchoolClass_Id(schoolClass.getId()) >= MAX_MEMBERS) {
            throw new DuplicateResourceException("This class is full. Classes can have up to 20 students.");
        }

        classMemberRepository.save(new ClassMember(schoolClass, student));
        classMemberRepository.flush();
        return summaryFor(schoolClass.getId());
    }

    @Transactional(readOnly = true)
    public LeaderboardResponse getLeaderboard(User user) {
        List<Standing> standings = allStandings();
        Long myClassId = classMemberRepository.findByUser_Id(user.getId())
                .map(member -> member.getSchoolClass().getId())
                .orElse(null);

        List<ClassLeaderboardEntry> topClasses = IntStream.range(0, Math.min(LEADERBOARD_LIMIT, standings.size()))
                .mapToObj(index -> standings.get(index).toEntry(index + 1, standings.get(index).id().equals(myClassId)))
                .toList();
        ClassLeaderboardEntry myClass = IntStream.range(0, standings.size())
                .filter(index -> standings.get(index).id().equals(myClassId))
                .mapToObj(index -> standings.get(index).toEntry(index + 1, true))
                .findFirst()
                .orElse(null);
        return new LeaderboardResponse(topClasses, myClass);
    }

    @Transactional(readOnly = true)
    public ClassSummaryResponse getMyClass(User user) {
        Long classId = classMemberRepository.findByUser_Id(user.getId())
                .map(member -> member.getSchoolClass().getId())
                .orElse(null);
        if (classId == null) return null;

        List<Standing> standings = allStandings();
        for (int index = 0; index < standings.size(); index++) {
            if (standings.get(index).id().equals(classId)) {
                return toSummary(standings.get(index), index + 1);
            }
        }
        return null;
    }

    private ClassSummaryResponse summaryFor(Long classId) {
        List<Standing> standings = allStandings();
        for (int index = 0; index < standings.size(); index++) {
            Standing standing = standings.get(index);
            if (standing.id().equals(classId)) {
                return toSummary(standing, index + 1);
            }
        }
        throw new ResourceNotFoundException("Class details could not be loaded.");
    }

    private ClassSummaryResponse toSummary(Standing standing, int rank) {
        return new ClassSummaryResponse(standing.id(), standing.name(), standing.joinCode(), standing.memberCount(), MAX_MEMBERS, standing.totalPoints(), rank);
    }

    private List<Standing> allStandings() {
        return jdbcTemplate.query(LEADERBOARD_SQL, (result, row) -> new Standing(
                result.getLong("id"),
                result.getString("name"),
                result.getString("join_code"),
                result.getInt("member_count"),
                result.getLong("total_points")
        ));
    }

    private String generateJoinCode() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String raw = RANDOM.ints(6, 0, CODE_ALPHABET.length())
                    .mapToObj(CODE_ALPHABET::charAt)
                    .map(String::valueOf)
                    .collect(Collectors.joining());
            String code = raw.substring(0, 3) + "-" + raw.substring(3);
            if (!schoolClassRepository.existsByJoinCode(code)) return code;
        }
        throw new IllegalStateException("Could not generate a unique class code. Please try again.");
    }

    private String normalizeJoinCode(String value) {
        String raw = value == null ? "" : value.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (raw.length() != 6) throw new IllegalArgumentException("Enter the 6-character class code.");
        return raw.substring(0, 3) + "-" + raw.substring(3);
    }

    private record Standing(Long id, String name, String joinCode, int memberCount, long totalPoints) {
        ClassLeaderboardEntry toEntry(int rank, boolean currentClass) {
            return new ClassLeaderboardEntry(id, name, memberCount, totalPoints, rank, currentClass);
        }
    }
}
