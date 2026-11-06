package com.examplatform.classes;

import com.examplatform.common.exception.DuplicateResourceException;
import com.examplatform.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClassServiceCapacityTest {
    @Mock private SchoolClassRepository schoolClassRepository;
    @Mock private ClassMemberRepository classMemberRepository;
    @Mock private JdbcTemplate jdbcTemplate;

    @InjectMocks private ClassService classService;

    @Test
    void refusesToJoinWhenClassAlreadyHasTwentyMembers() {
        SchoolClass schoolClass = mock(SchoolClass.class);
        when(schoolClassRepository.findByJoinCodeForUpdate("ABC-123")).thenReturn(Optional.of(schoolClass));
        when(schoolClass.getId()).thenReturn(19L);
        when(classMemberRepository.findByUser_Id(55L)).thenReturn(Optional.empty());
        when(classMemberRepository.countBySchoolClass_Id(19L)).thenReturn(20L);
        User student = new User();
        student.setId(55L);

        assertThrows(DuplicateResourceException.class, () -> classService.joinClass("ABC123", student));
        verify(classMemberRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }
}
