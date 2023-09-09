import { useContext } from "react";
import { QosOption } from "./index";
import { Card, Form, Input, Row, Col, Button, Select } from 'antd';


const Subscriber = ({sub, unSub, showUnSub}) => {
    const [form] = Form.useForm();
    const qosOptions = useContext(QosOption);

    //MQTT 구독에 대한 topic & Qos
    const record = {
        topic: 'testtopic/react',
        qos: 0
    }

    const onFinish = (values) => {
        sub(values);
    }

    const handleUnSub = () => {
        const values = form.getFieldsValue();
        unSub(values);
    }

    const SubForm = (
        <Form
            layout="vertical"
            name="basic"
            form={form}
            initialValues={record}
            onFinish={onFinish}
        >
            <Row gutter={20}>
                <Col span={12}>
                    <Form.Item>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item>
                        <Select options={qosOptions} />
                    </Form.Item>
                </Col>
                <Col span={8} offset={16} style={{textAlign:'right'}}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Subscribe
                        </Button>
                        {showUnSub ? (
                            <Button
                                type="danger"
                                style={{marginLeft:'10px'}}
                                onClick={handleUnSub}
                            >
                                Unsubscribe
                            </Button>
                        ) : null}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );

    return (
        <Card title="Subscriber">
            {SubForm}
        </Card>
    );
}

export default Subscriber;