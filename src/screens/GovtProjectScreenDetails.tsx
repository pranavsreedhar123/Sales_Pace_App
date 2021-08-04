import React, {useState, useEffect, useCallback} from 'react';
import _ from 'lodash';

// import { SearchBar } from 'react-native-elements';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from 'react-native';
import {Helpers} from '../utils/Helpers';
// import {getGovtProjectDetails} from '../services/govtProjectsAPI';
import {Icon} from 'react-native-elements';
import {Component} from 'react';
import {TouchableHighlight} from 'react-native';
import {Modal} from 'react-native';
const [tender_id, setTender_id] = useState<any>([]);
const [tender_source, setTender_source] = useState<any>([]);
const [isVisible, setVisiblity] = useState<any>([]);
const [isLoading, setLoading] = useState(true);
const [tenderDataDetail, setTenderDataDetail] = useState<any>([]);

function detailList(tender_id: any, tender_source: any, isVisible: any) {}

class ModalExample extends Component {
  state = {
    modalVisible: false,
  };
  toggleModal(visible: boolean) {
    this.setState({modalVisible: visible});
  }
  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={styles.modal}>
            <Text style={styles.text}>Modal is open!</Text>

            <TouchableHighlight
              onPress={() => {
                this.toggleModal(!this.state.modalVisible);
              }}>
              <Text style={styles.text}>Close Modal</Text>
            </TouchableHighlight>
          </View>
        </Modal>

        <TouchableHighlight
          onPress={() => {
            this.toggleModal(true);
          }}>
          <Text style={styles.text}>Open Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
export default ModalExample;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
    padding: 100,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7021a',
    padding: 100,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
});

// const GovtProjectScreenDetail =()=>{
//   //   setTender_id('44418');
//   //   setTender_source('1');
//   //   const api='http://l01svindeca0101.zl.if.atcsg.net:6565/Api/Tender/GetTenderDetails?source_id='+tender_source+'&tender_id='+tender_id

//   //   const fetchMyAPI = useCallback(async () => {
//   //   let response = await fetch(api)
//   //   response = await response.json()
//   //   setTenderDataDetail(response)
//   //   let loadingFalse=false;
//   //  setLoading(loadingFalse)
//   // }, []) // if userId changes, useEffect will run again. if you want to run only once, just leave array empty []

//   // useEffect(() => {
//   //   fetchMyAPI()
//   // }, [ ])

// return(

//     <View>
// <Text>Hello World</Text>
//     </View>
// )

// }
// export default GovtProjectScreenDetail
