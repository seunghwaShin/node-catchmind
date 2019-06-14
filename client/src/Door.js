import React from 'react';
import { Input, Radio, Form, Button } from 'antd';

const colorPool = ['#ff4444', '#fa8072', '#ffa500', '#bada55','#008000', '#008080', '#0099cc','#3b5998',];

class Door extends React.Component {

    state = {
        name: '',
        color: ''
    }
    
    changeInput = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    changeRadio = (e) => {
        this.setState({
            color: e.target.value
        });
    }

    confirmUser = (e) => {
        e.preventDefault();
        const { name , color} = this.state;

        if(name.trim() !== ''){
            this.props.createUser({name, color});
        }        
    }

    render(){
        return(
            <Form id="door" onSubmit={this.confirmUser}>
                <Radio.Group defaultValue="orange" onChange={this.changeRadio}>
                    {
                        colorPool.map(color => (
                            <Radio.Button value={color} style={{backgroundColor: color}}></Radio.Button>
                        ))
                    }
                </Radio.Group>
                <Input maxLength={10} style={{width: '160px', marginRight: '5px'}} id="name" name="name" type="text" placeholder="name" onChange={this.changeInput} value={this.state.name}/>
                <Button type="primary" htmlType="submit">입장</Button>
            </Form>
        );
    }
}

export default Door;