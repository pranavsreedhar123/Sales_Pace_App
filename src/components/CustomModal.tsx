import React, {useContext, useEffect, useRef} from 'react';
// import {Modalize, ModalizeProps} from 'react-native-modalize';
// import {Platform, View} from 'react-native';
// import {ThemeContext} from 'context/theme/ThemeContext';
// import {Title} from '../Title';
// import {useWindowHeight} from 'services/hooks/useWindowHeight';
// import {useWindowWidth} from 'services/hooks/useWindowWidth';

// interface Props {
//     visible: boolean;
//     onClosed: () => void;
//     title?: string;
//     backgroundColor?: string;
//     isDynamicRow?: boolean | 0 | undefined;
// }

// export const CustomModal = (props: Props & ModalizeProps): JSX.Element => {
//     const modalizeRef = useRef<Modalize>(null);

//     const {windowWidth} = useWindowWidth();
//     const {windowHeight} = useWindowHeight();
//     const {theme} = useContext(ThemeContext);

//     useEffect(() => {
//         props.visible
//             ? modalizeRef.current?.open()
//             : modalizeRef.current?.close();
//     }, [props.visible]);

//     return (
//         <Modalize
//             withReactModal={Platform.OS === 'ios'}
//             ref={modalizeRef}
//             withHandle={false}
//             disableScrollIfPossible={false}
//             adjustToContentHeight={true}
//             useNativeDriver
//             rootStyle={{
//                 position: 'absolute',
//                 height: windowHeight,
//                 width: windowWidth / 2,
//                 top: -windowHeight + (Platform.OS === 'ios' ? 300 : 200),
//                 left: windowWidth / 2,
//                 zIndex: 1000,
//             }}
//             overlayStyle={{
//                 backgroundColor: 'transparent',
//             }}
//             childrenStyle={{
//                 backgroundColor: props.backgroundColor || theme.colors.lightest,
//                 height: 250,
//             }}
//             HeaderComponent={
//                 props.title && (
//                     <Title h2 style={{textAlign: 'center', marginVertical: 20}}>
//                         {props.title}
//                     </Title>
//                 )
//             }
//             onClosed={props.onClosed}>
//             <View style={{flex: 1}}>{props.children}</View>
//         </Modalize>
//     );
// };
