package com.examplatform.classes;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class ClassMemberId implements Serializable {
    @Column(name = "class_id")
    private Long classId;

    @Column(name = "user_id")
    private Long userId;

    public ClassMemberId(Long classId, Long userId) {
        this.classId = classId;
        this.userId = userId;
    }
}
