import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function TablePagination({ 
  page, 
  numberOfPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}) {
  const from = page * itemsPerPage + 1;
  const to = Math.min((page + 1) * itemsPerPage, totalItems);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {from}-{to} de {totalItems}
      </Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => onPageChange(page - 1)} 
          disabled={page === 0}
          style={[styles.button, page === 0 && styles.disabled]}
        >
          <FontAwesome name="chevron-left" size={14} color={theme.colors.tableText} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onPageChange(page + 1)} 
          disabled={page >= numberOfPages - 1}
          style={[styles.button, page >= numberOfPages - 1 && styles.disabled]}
        >
          <FontAwesome name="chevron-right" size={14} color={theme.colors.tableText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.tableBorder,
    backgroundColor: theme.colors.tableHeaderBackground,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.tableText,
    marginRight: 24,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    padding: 4,
  },
  disabled: {
    opacity: 0.3,
  }
});
