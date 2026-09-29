#include "environment_sensor.h"

#include <stdint.h>

#include "esp_log.h"
#include "esp_check.h"
#include "esp_rom_sys.h"
#include "driver/i2c_master.h"

#include "bme68x.h"

static const char *TAG = "bme680";

static i2c_master_bus_handle_t bus;
static i2c_master_dev_handle_t sensor;

static struct bme68x_dev bme;

/*
 * Bosch calls this whenever it wants to read registers
 * from the BME680.
 */
static BME68X_INTF_RET_TYPE bme680_i2c_read(
    uint8_t reg_addr,
    uint8_t *reg_data,
    uint32_t length,
    void *intf_ptr)
{
    esp_err_t err = i2c_master_transmit_receive(
        sensor,
        &reg_addr,
        1,
        reg_data,
        length,
        1000
    );

    return err == ESP_OK ? BME68X_INTF_RET_SUCCESS : -1;
}

/*
 * Bosch calls this whenever it wants to write registers
 * to the BME680.
 */
static BME68X_INTF_RET_TYPE bme680_i2c_write(
    uint8_t reg_addr,
    const uint8_t *reg_data,
    uint32_t length,
    void *intf_ptr)
{
    uint8_t buffer[length + 1];

    buffer[0] = reg_addr;

    for (uint32_t i = 0; i < length; i++)
    {
        buffer[i + 1] = reg_data[i];
    }

    esp_err_t err = i2c_master_transmit(
        sensor,
        buffer,
        length + 1,
        1000
    );

    return err == ESP_OK ? BME68X_INTF_RET_SUCCESS : -1;
}

/*
 * Bosch sometimes needs to wait between operations.
 * The Bosch API gives us the delay in microseconds.
 */
static void bme680_delay_us(uint32_t period, void *intf_ptr)
{
    esp_rom_delay_us(period);
}

void environment_sensor_init(void)
{
    // Create second I2C bus for BME680
    i2c_master_bus_config_t bus_config = {
        .i2c_port = I2C_NUM_1,
        .sda_io_num = GPIO_NUM_11,
        .scl_io_num = GPIO_NUM_12,
        .clk_source = I2C_CLK_SRC_DEFAULT,
        .glitch_ignore_cnt = 7,
        .flags.enable_internal_pullup = true,
    };

    ESP_ERROR_CHECK(
        i2c_new_master_bus(&bus_config, &bus)
    );

    // Add BME680 at the address we already confirmed works
    i2c_device_config_t device_config = {
        .dev_addr_length = I2C_ADDR_BIT_LEN_7,
        .device_address = 0x77,
        .scl_speed_hz = 100000,
    };

    ESP_ERROR_CHECK(
        i2c_master_bus_add_device(
            bus,
            &device_config,
            &sensor
        )
    );

    /*
     * Give the Bosch driver our ESP32-specific functions.
     */
    bme.intf = BME68X_I2C_INTF;
    bme.read = bme680_i2c_read;
    bme.write = bme680_i2c_write;
    bme.delay_us = bme680_delay_us;
    bme.intf_ptr = NULL;
    bme.amb_temp = 25;

    int8_t result = bme68x_init(&bme);

    if (result != BME68X_OK)
    {
        ESP_LOGE(TAG, "BME680 initialization failed: %d", result);
        return;
    }

    ESP_LOGI(TAG, "BME680 initialized successfully");


    // Configure measurements
    struct bme68x_conf conf = {
        .os_hum = BME68X_OS_2X,
        .os_temp = BME68X_OS_8X,
        .os_pres = BME68X_OS_4X,
        .filter = BME68X_FILTER_SIZE_3,
        .odr = BME68X_ODR_NONE,
    };

    result = bme68x_set_conf(&conf, &bme);

    if (result != BME68X_OK)
    {
        ESP_LOGE(TAG, "Failed to configure BME680: %d", result);
        return;
    }

    ESP_LOGI(TAG, "BME680 configured successfully");
}

environment_reading_t environment_sensor_read(void)
{
    environment_reading_t reading = {0};

    int8_t result = bme68x_set_op_mode(
        BME68X_FORCED_MODE,
        &bme
    );

    if (result != BME68X_OK)
    {
        ESP_LOGE(TAG, "Failed to start measurement: %d", result);
        return reading;
    }

    uint32_t measurement_time =
        bme68x_get_meas_dur(
            BME68X_FORCED_MODE,
            NULL,
            &bme
        );

    bme.delay_us(measurement_time, bme.intf_ptr);

    struct bme68x_data data;
    uint8_t fields = 0;

    result = bme68x_get_data(
        BME68X_FORCED_MODE,
        &data,
        &fields,
        &bme
    );

    if (result != BME68X_OK)
    {
        ESP_LOGE(TAG, "Failed to read BME680: %d", result);
        return reading;
    }

    if (fields == 0)
    {
        ESP_LOGW(TAG, "No new BME680 data");
        return reading;
    }

    reading.temperature = data.temperature;
    reading.humidity = data.humidity;

    return reading;
}