import { createContext, useEffect, useState } from "react";
import mqtt from 'mqtt';

import Subscriber from './Subscriber';
import Connection from "./Connection";
import Publisher from "./Publisher";
import Receiver from "./Receiver";


export const QosOption = createContext([]);

const qosOption = [
    {
        label: '0',
        value: 0
    },
    {
        label: '1',
        value: 1
    },
    {
        label: '2',
        value: 2
    }
]

const DetailMqtt = () => {
    const [connectStatus, setConnectStatus] = useState('Connect');
    const [client, setClient] = useState(null);
    const [isSubed, setIsSubed] = useState(false);
    const [payload, setPayload] = useState({});

    useEffect(()=>{
        if (client) {
            //connect 이벤트 발생시
            client.on('connect', () => {
                setConnectStatus('Connected');
                console.log('connection successful');
            })

            //error 이벤트 발생시
            client.on('error', (err)=>{
                console.error('Connection error: ', err);
                client.end();
            })

            //reconnect 이벤트 발생시
            client.on('reconnect', ()=>{
                setConnectStatus('Reconnecting');
            })

            //message 이벤트 발생시
            client.on('message', (topic, message)=>{
                const payload = { topic, message: message.toString() };
                setPayload(payload);
                console.log(`received message: ${message} from topic: ${topic}`);
            })
        }
    }, [client]);

    const mqttConnect = (host, mqttOption) => {
        setConnectStatus('Connecting');
        setClient(mqtt.connect(host, mqttOption));
    }

    const mqttDisconnect = () => {
        if (client) {
            try{
                client.end(false, () => {
                    setConnectStatus('Connect');
                    console.log('disconnected successfully');
                })
            } catch(error){
                console.log('disconnect error:', error);
            }
        }
    }

    //publish message
    const mqttPublish = (context) => {
        if (client) {
          const { topic, qos, payload } = context;
          client.publish(topic, payload, { qos }, (error) => {
            if (error) {
              console.log('Publish error: ', error);
            }
          })
        }
    }

    const mqttSub = (subscription) => {
        if (client) {
            const { topic, qos } = subscription;

            client.subscribe(topic, {qos}, (error)=>{
                if(error){
                    console.log('Subscribe to topics error', error);
                    return;
                }
                console.log(`Subscribe to topics: ${topic}`)
                setIsSubed(true);
            })
        }
    }

    const mqttUnSub = (subscription) => {
        if (client) {
            const { topic, qos } = subscription;

            client.unsubscribe(topic, {qos}, (error)=>{
                if(error){
                    console.log('Unsubscribe error', error);
                    return;
                }
                console.log(`UnSubscribed topic: ${topic}`);
                setIsSubed(false);
            })
        }
    }

    return (
        <>
            <Connection 
                connect={mqttConnect}
                disconnect={mqttDisconnect}
                connectBtn={connectStatus}
            />
            <QosOption.Provider value={qosOption}>
                <Subscriber sub={mqttSub} unSub={mqttUnSub} showUnSub={isSubed} />
                <Publisher publish={mqttPublish} />
            </QosOption.Provider>
            <Receiver payload={payload} />
        </>
    )
}

export default DetailMqtt;