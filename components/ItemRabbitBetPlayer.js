import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, CheckBox } from 'react-native-elements';

class ItemRabbitBetPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        checked: false
    };
  }

  render() {
      const { item }=this.props;
    return (
        <ListItem
            title={item.player.nick_name}
            subtitle={'Handicap de campo: ' + item.handicap}
            leftElement={
                <CheckBox
                    title='Add'
                    checked={this.state.checked}
                    onPress={() => {
                        if (this.state.checked == true) {
                            this.setState({
                                checked: false
                            });
                            this.props.removePlayer(item.id);
                        } else {
                            this.setState({
                                checked: true
                            });
                            this.props.addPlayer(item.id);
                        }
                    }}
                />
            }
            bottomDivider
        />
    )
  }
}

export default ItemRabbitBetPlayer;
