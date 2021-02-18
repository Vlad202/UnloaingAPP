import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    //   backgroundColor: '#FFFEF7'
    },
    containerList: {
        flex: 1,
        backgroundColor: '#fff',
        // backgroundColor: '#FFFEF7'
      },
    input: {
        borderBottomColor: '#45BA52',
        borderBottomWidth: 2,
        minWidth: '70%',
        height: 40,
        margin: 20,
    },
    btn: {
        margin: 10,
        minWidth: 110,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45BA52',
        borderRadius: 50,
    },
    btn_client: {
        margin: 5,
        minWidth: 90,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45BA52',
        borderRadius: 50,
    },
    btn_group: {
        margin: 10,
        minWidth: '70%',
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45BA52',
        borderRadius: 50,
    },
    btn_text: {
        color: 'white'
    },
    btn_group_text: {
        color: 'white',
        fontSize: 16,
    },
    client_item_name: {
        fontSize: 18,
        color: '#333',
    },
    client_view: {
        // width: '100%',
        borderColor: '#999',
        borderTopWidth: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    clientsPickerContainer: {
        marginTop: 25,
        marginBottom: 25,
    },
    clientsPickerText: {
        color: '#c4c4c4',
        fontSize: 16
    },
    header_view: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'space-between',
    },
    btn_logout: {
        margin: 10,
        width: 100,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45BA52',
        borderRadius: 50,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    container_header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    header_title: {
        fontSize: 20,
        fontWeight: '700'
    },
    btn_group_client: {
        flexDirection: 'row'
    }
});
export default styles;  