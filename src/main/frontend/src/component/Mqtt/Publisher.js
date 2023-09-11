import { Card, Form, Input, Row, Col, Button, Select } from 'antd';
import { useContext } from 'react';
import { QosOption } from './index';

const Publisher = ({publish}) => {

    const [form] = Form.useForm();
    const qosOptions = useContext(QosOption);

    //발행 메시지에 대한 topic, qos
    const record = {
        topic: 'testtopic/react',
        qos: 0
    };

    const onFinish = (values) => {
        publish(values);
    }

    const PublishForm = (
        <Form
            layout='vertical'
            name='basic'
            form={form}
            initialValues={record}
            onFinish={onFinish}
        >
            <Row gutter={20}>
                <Col span={12}>
                    <Form.Item
                        label="Topic"
                        name="topic"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Qos"
                        name="qos"
                    >
                        <Select options={qosOptions} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Payload"
                        name="payload"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Col>
                <Col span={8} offset={16} style={{textAlign:'right'}}>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Publish
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )

    return (
        <Card
            title="publisher"
        >
            {PublishForm}
        </Card>
    )
}

export default Publisher;