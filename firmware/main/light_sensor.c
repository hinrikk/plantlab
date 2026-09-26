#include "light_sensor.h"

#include <stdint.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_check.h"
#include "driver/i2c_master.h"

// Keep the sensor handle available to both functions
static i2c_master_dev_handle_t sensor;

void light_sensor_init(void)
{
    // Configure I2C bus
    i2c_master_bus_config_t bus_config = {
        .i2c_port = I2C_NUM_0,
        .sda_io_num = GPIO_NUM_8,
        .scl_io_num = GPIO_NUM_9,
        .clk_source = I2C_CLK_SRC_DEFAULT,
        .glitch_ignore_cnt = 7,
        .flags.enable_internal_pullup = true,
    };

    i2c_master_bus_handle_t bus;

    ESP_ERROR_CHECK(
        i2c_new_master_bus(&bus_config, &bus)
    );

    // Configure BH1750
    i2c_device_config_t device_config = {
        .dev_addr_length = I2C_ADDR_BIT_LEN_7,
        .device_address = 0x23,
        .scl_speed_hz = 100000,
    };

    ESP_ERROR_CHECK(
        i2c_master_bus_add_device(
            bus,
            &device_config,
            &sensor
        )
    );
}

float light_sensor_read_lux(void)
{
    // Start light measurement
    uint8_t command = 0x20;

    ESP_ERROR_CHECK(
        i2c_master_transmit(sensor, &command, 1, 1000)
    );

    // Wait for measurement
    vTaskDelay(pdMS_TO_TICKS(200));

    // Read measurement
    uint8_t data[2];

    ESP_ERROR_CHECK(
        i2c_master_receive(sensor, data, 2, 1000)
    );

    // Convert raw measurement to lux
    uint16_t raw = ((uint16_t)data[0] << 8) | data[1];

    return raw / 1.2f;
}