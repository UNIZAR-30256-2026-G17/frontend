import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

import Button from '../ui/Button';

export const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Montgomery SafetyMap</Text>

      <View style={styles.rightSection}>
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Estadísticas</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0B800',
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
    color: theme.colors.headerText,
    fontWeight: '600',
  },
  loginButton: {
    marginVertical: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
