#pragma once
#include <stdint.h>

void api_send_reading(
    int64_t device_id,
    float light_lux,
    float temperature,
    float humidity
);