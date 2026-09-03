package com.designtravel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayPlan {
    private int dayNumber;
    private String title;
    private String theme;
    @Builder.Default
    private List<Activity> activities = new ArrayList<>();
}
