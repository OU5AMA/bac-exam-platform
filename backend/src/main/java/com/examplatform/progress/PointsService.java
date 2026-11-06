package com.examplatform.progress;

import com.examplatform.classes.ClassMember;
import com.examplatform.classes.ClassMemberRepository;
import com.examplatform.user.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PointsService {
    private static final String CLASS_POINTS_SQL = """
            SELECT COALESCE(SUM(up.score), 0)
            FROM class_members cm
            LEFT JOIN user_progress up ON up.user_id = cm.user_id
            WHERE cm.class_id = ?
            """;

    private final UserProgressRepository userProgressRepository;
    private final ClassMemberRepository classMemberRepository;
    private final JdbcTemplate jdbcTemplate;

    public PointsService(
            UserProgressRepository userProgressRepository,
            ClassMemberRepository classMemberRepository,
            JdbcTemplate jdbcTemplate
    ) {
        this.userProgressRepository = userProgressRepository;
        this.classMemberRepository = classMemberRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public PointsResponse getPoints(User user) {
        long individualPoints = userProgressRepository.sumScoresByUserId(user.getId());
        return classMemberRepository.findByUser_Id(user.getId())
                .map(member -> classPointsFor(member, individualPoints))
                .orElseGet(() -> new PointsResponse(individualPoints, null, null));
    }

    private PointsResponse classPointsFor(ClassMember member, long individualPoints) {
        Long points = jdbcTemplate.queryForObject(CLASS_POINTS_SQL, Long.class, member.getSchoolClass().getId());
        return new PointsResponse(individualPoints, member.getSchoolClass().getName(), points == null ? 0L : points);
    }
}
