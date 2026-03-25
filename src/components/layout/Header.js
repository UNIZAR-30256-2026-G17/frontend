import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { theme } from '../../theme';

import Button from '../ui/Button';

export const Header = () => {
  const navigation = useNavigation();

  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name
  );

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.title}>Montgomery SafetyMap</Text>
      </TouchableOpacity>



      <View style={styles.rightSection}>
        <View style={styles.tabs}>

          <TouchableOpacity
            style={[styles.tab, currentRoute === 'Map' && styles.activeTab]}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={[styles.tabText]}>
              Mapa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentRoute === 'Stats' && styles.activeTab]}
            onPress={() => navigation.navigate('Stats')}
          >
            <Text style={[styles.tabText]}>
              Estadísticas
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Iniciar sesión"
          variant="header"
          onPress={() => navigation.navigate('')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.headerBackground,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.headerText,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    marginRight: 20,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.headerTabText,
    fontWeight: '600',
  },
  loginButton: {
    marginVertical: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.headerTabActiveBorder,
    backgroundColor: theme.colors.headerTabActiveBackground,
    borderRadius: 6,
  },
});
