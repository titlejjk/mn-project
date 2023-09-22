package com.project.config;

import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class TemperatureScheduler {

    private final MqttClient mqttClient;

    private int currentTemperature = 20;  // 초기 온도

    // 5초마다 이 메서드를 실행
//    @Scheduled(fixedRate = 5000)
    public int publishTemperature() {
        try {
            currentTemperature += 10;  // 온도를 10도씩 증가
            publish("temperature", String.valueOf(currentTemperature));
        } catch (MqttException e) {
            System.out.println("Failed to publish temperature: " + e.getMessage());
        }
        return currentTemperature;
    }

    public int resetTemperature() {
        currentTemperature = 20;

        return currentTemperature;
    }

    private void publish(String topic, String payload) throws MqttException {
        if (!mqttClient.isConnected()) {
            mqttClient.connect();
        }
        MqttMessage message = new MqttMessage(payload.getBytes());
        mqttClient.publish(topic, message);
    }

}