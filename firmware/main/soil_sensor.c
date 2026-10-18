#include "soil_sensor.h"

#include "esp_log.h"
#include "esp_adc/adc_oneshot.h"

static const char *TAG = "soil_sensor";

static adc_oneshot_unit_handle_t adc_handle;

void soil_sensor_init(void)
{
    adc_oneshot_unit_init_cfg_t init_config = {
        .unit_id = ADC_UNIT_1,
    };

    ESP_ERROR_CHECK(adc_oneshot_new_unit(&init_config, &adc_handle));

    adc_oneshot_chan_cfg_t channel_config = {
        .atten = ADC_ATTEN_DB_12,
        .bitwidth = ADC_BITWIDTH_DEFAULT,
    };

    // GPIO4 = ADC1_CHANNEL_3
    ESP_ERROR_CHECK(adc_oneshot_config_channel(
        adc_handle,
        ADC_CHANNEL_3,
        &channel_config
    ));

    ESP_LOGI(TAG, "Soil moisture sensor initialized");
}

int soil_sensor_read(void)
{
    int raw = 0;

    ESP_ERROR_CHECK(adc_oneshot_read(
        adc_handle,
        ADC_CHANNEL_3,
        &raw
    ));

    return raw;
}