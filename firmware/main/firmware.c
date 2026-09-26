#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_log.h"
#include "nvs_flash.h"

// Custom modules
#include "wifi.h"
#include "api.h"
#include "light_sensor.h"

static void read_light_task(void *arg)
{
    TickType_t last_sent = xTaskGetTickCount();

    while (1)
    {
        float lux = light_sensor_read_lux();

        ESP_LOGI("bh1750", "Light: %.2f lux", lux);

        if (wifi_is_connected() &&
            xTaskGetTickCount() - last_sent >= pdMS_TO_TICKS(30000))
        {
            last_sent = xTaskGetTickCount();
            api_send_reading(lux);
        }

        vTaskDelay(pdMS_TO_TICKS(800));
    }
}

void app_main(void)
{
    ESP_ERROR_CHECK(nvs_flash_init());

    wifi_init();
    light_sensor_init();

    xTaskCreate(
        read_light_task,
        "bh1750_task",
        4096,
        NULL,
        5,
        NULL
    );
}