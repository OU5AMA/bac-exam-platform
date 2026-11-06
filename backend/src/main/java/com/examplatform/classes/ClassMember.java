package com.examplatform.classes;

import com.examplatform.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "class_members")
@Getter
@Setter
@NoArgsConstructor
public class ClassMember {
    @EmbeddedId
    private ClassMemberId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("classId")
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;

    public ClassMember(SchoolClass schoolClass, User user) {
        this.id = new ClassMemberId(schoolClass.getId(), user.getId());
        this.schoolClass = schoolClass;
        this.user = user;
    }

    @PrePersist
    void onCreate() {
        if (joinedAt == null) joinedAt = Instant.now();
    }
}
