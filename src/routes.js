import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';

// Troca de tela sem nenhuma animação e opção para retornar
export default createAppContainer(
  createSwitchNavigator({
    Login,
    Main,
  })
);

// // Com cabeçalho com opções para botões de navegação
// export default createAppContainer(
//   createStackNavigator({
//     Login,
//     Main,
//   })
// );

// // Navegação por abas no rodape da aplicação
// export default createAppContainer(
//   createBottomTabNavigator({
//     Login,
//     Main,
//   })
// );

// // Navegação por abas no topo da aplicação
// export default createAppContainer(
//   createMaterialTopTabNavigator({
//     Login,
//     Main,
//   })
// );

// // Cria menu de navegação lateral
// export default createAppContainer(
//   createDrawerNavigator({
//     Login,
//     Main,
//   })
// );
