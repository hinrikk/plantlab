#pragma once

typedef struct {
    float temperature;
    float humidity;
} environment_reading_t;

void environment_sensor_init(void);
environment_reading_t environment_sensor_read(void);