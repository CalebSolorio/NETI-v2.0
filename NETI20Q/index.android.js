import React, { Component } from 'react';
import {  AppRegistry, Button, TouchableHighlight, ListView, ActivityIndicator, StyleSheet,  Text,  View} from 'react-native';
import Api from './utility/Api'
import parseDrug from './utility/ParseDrug'


export default class NETI20Q extends Component {

    constructor(props) {
        super(props);
        this.state = {
            drugData: null,
            consistencyData: null,
            containerData: null,
            colorData: null,
            colorChoice: null,
            colorChoiceHash: null,
            containerChoice: null,
            containerChoiceHash: null,
            consistencyChoice: null,
            consistencyChoiceHash: null,
            drugName: null,
            drugDescription: null,
        }
    }

    //load data
    async componentWillMount(){
        this.setState({
            drugData: await Api.getDrugs(),
            consistencyData: await Api.getConsistencies(),
            containerData: await Api.getContainers(),
            colorData: await Api.getColors()
        })
    }

    //set color after it has been selected
    setColor(color, hash){
        this.setState({
            colorChoice: color,
            colorChoiceHash: hash
        });
    }

    //set consistency after it has been selected
    setConsistency(consistency, hash){
        this.setState({
            consistencyChoice: consistency,
            consistencyChoiceHash: hash,
        });
    }

    //set container after it has been selected
    setContainer(container, hash){
        this.setState({
            containerChoice: container,
            containerChoiceHash: hash,
        });
    }

    //find Drug
    getDrug(color, consistency, container){
        drug = parseDrug.getDrug(color, consistency, container, this.state.drugData);
        console.log(drug.name)
        this.setState({
            drugName: drug.name,
            drugDescription: drug.description,
        });
    }

    //reset
    reset(){
        this.setState({
            drugName: null,
            drugDescription: null,
            colorChoice: null,
            consistencyChoice: null,
            containerChoice: null
        })
    }

  render() {

  //render loader until data is finished loading
    if (!this.state.drugData || !this.state.consistencyData || !this.state.containerData
            || !this.state.colorData) {
      return (
        <ActivityIndicator
          animating={true}
          style={styles.indicator}
          size="large"
        />
      );
    } //loading screen end


  //render once all data is loaded
    if(!this.state.drugName || !this.state.drugDescription){
        return (
          <View style={styles.container}>
            <Text style= {styles.title}> NETI 20 Questions </Text>
            <View style={styles.buttonRow}>
                <Text> color: {this.state.colorChoice} </Text>
                <Text> consistency: {this.state.consistencyChoice} </Text>
                <Text> container: {this.state.containerChoice} </Text>
            </View>
            <Text style= {styles.questions}> What is the color of the Drug? </Text>
            <ListView
                dataSource={DS.getColorData(this.state.colorData)}
                renderRow={(rowData) =>
                    <TouchableHighlight onPress={() => this.setColor(rowData.name, rowData.hex)} style={{backgroundColor: '#'+ rowData.hex }} >
                        <View>
                            <Text style={styles.questionText}>  {rowData.name} </Text>
                        </View>
                    </TouchableHighlight>
                }
            />
            <Text style= {styles.questions}> What is the consistency of the Drug? </Text>
            <ListView
                dataSource={DS.getConsistencyData(this.state.consistencyData)}
                renderRow={(rowData) =>
                    <TouchableHighlight onPress={() => this.setConsistency(rowData.name, rowData.hash)}  >
                        <View>
                            <Text style={styles.questionText}>  {rowData.name} </Text>
                        </View>
                    </TouchableHighlight>
                }
            />
            <Text style= {styles.questions}> What is drug contained in? </Text>
              <ListView
                  dataSource={DS.getConsistencyData(this.state.containerData)}
                  renderRow={(rowData) =>
                      <TouchableHighlight onPress={() => this.setContainer(rowData.name, rowData.hash)}  >
                          <View>
                              <Text style={styles.questionText}>  {rowData.name} </Text>
                          </View>
                      </TouchableHighlight>
                  }
              />
            <Button onPress= {() => this.getDrug(this.state.colorChoiceHash, this.state.consistencyChoiceHash, this.state.containerChoiceHash)}
                    title="Find Drug"
            />
          </View>
        );
    }//drug attribute selection screen end
    return(
        <View>
            <Text> {this.state.drugName} </Text>
            <Text> {this.state.drugDescription} </Text>
            <Button onPress= {() => this.reset()}
                    title="Find another drug"
            />
        </View>
    )

  }//render end
}//class end

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  questions: {
    textAlign: 'left',
  },
  buttonRow: {
    flexDirection: 'row'
  },
  questionText: {
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {width: 1, height: 1},
    textAlign: 'center',
  },

});


var DS = {

    getColorData(colorData){
        var colorArray = [];
        for(var color in colorData){
            colorArray.push({hex: color, name: colorData[color]})
        }
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return ds.cloneWithRows(colorArray)
    },

    getConsistencyData(consistencyData){
        var consistencyArray = [];
        for(var consistencies in consistencyData){
            consistencyArray.push({name: consistencyData[consistencies].name, hash: consistencies})
        }
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return ds.cloneWithRows(consistencyArray)
    },

    getContainerData(containerData){
        var containerArray = [];
        for(var containers in containerData){
            containerArray.push({name: containerData[containers], hash: containers})
        }
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return ds.cloneWithRows(containerArray)
    }

}


AppRegistry.registerComponent('NETI20Q', () => NETI20Q);



