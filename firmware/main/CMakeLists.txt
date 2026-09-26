idf_component_register(
    SRCS "light_sensor.c" "firmware.c" "wifi.c" "api.c"
    INCLUDE_DIRS "."
    PRIV_REQUIRES
        esp_wifi
        esp_event
        esp_netif
        esp_http_client
        nvs_flash
        esp_driver_i2c
)
