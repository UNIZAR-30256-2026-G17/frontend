/**
 * @file AlertCard.js
 * @description Componente de tarjeta para mostrar detalles de una alerta, con acciones condicionales según el estado y rol.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { FontAwesome } from '@expo/vector-icons';
import Button from './Button';

/**
 * Componente AlertCard
 * @param {Object} alert - Datos de la alerta
 * @param {Function} onDelete - Función para eliminar (admin/policía)
 * @param {Function} onAttend - Función para atender (admin/policía)
 * @param {Function} onConfirm - Función para confirmar (ciudadano)
 * @param {Function} onDiscard - Función para descartar (ciudadano)
 * @param {Boolean} isMobile - Si se está visualizando en móvil
 */
export default function AlertCard({ alert, userRole, onDelete, onAttend, onConfirm, onDiscard, isMobile }) {
  const isPending = alert.status === 'pending';
  const isAttended = alert.status === 'attended';
  const isDeleted = alert.status === 'deleted';

  const confirmedByMe = alert.confirmedByMe;
  const discardedByMe = alert.discardedByMe;
  const hasActed = confirmedByMe || discardedByMe;

  const isStaff = userRole === 'police' || userRole === 'admin';

  /**
   * Obtiene el nombre del icono de FontAwesome según el estado
   */
  const getIconName = () => {
    if (confirmedByMe) return 'check-circle';
    if (discardedByMe || isDeleted) return 'trash';
    return 'warning';
  };

  /**
   * Obtiene el color del icono según el estado
   */
  const getIconColor = () => {
    if (confirmedByMe || isAttended) return theme.colors.success;
    if (discardedByMe || isDeleted) return theme.colors.danger;
    return theme.colors.textSecondary;
  };

  /**
   * Obtiene el estilo de la tarjeta según el estado
   */
  const getCardStyle = () => {
    if (confirmedByMe) return styles.confirmedCard;
    if (discardedByMe) return styles.discardedCard;
    if (isAttended) return styles.attendedCard;
    if (isDeleted) return styles.deletedCard;
    return null;
  };

  /**
   * Obtiene el color de fondo del contenedor del icono
   */
  const getIconBg = () => {
    if (confirmedByMe || isAttended) return theme.colors.success + '20';
    if (discardedByMe || isDeleted) return theme.colors.danger + '20';
    return theme.colors.cardBorder;
  };

  return (
    <View style={[styles.alertCard, isMobile && styles.alertCardMobile, getCardStyle()]}>

      {/* Header */}
      <View style={styles.alertCardHeader}>
        <View style={[styles.alertIconContainer, { backgroundColor: getIconBg() }]}>
          <FontAwesome name={getIconName()} size={20} color={getIconColor()} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.alertTitle}>
              {alert.title || `Alerta ${alert._id.slice(-4)}`}
            </Text>
            {(isAttended || isDeleted) && (
              <View style={[
                styles.statusBadge,
                isAttended ? styles.statusBadgeAttended : styles.statusBadgeDeleted
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  { color: isAttended ? theme.colors.success : theme.colors.danger }
                ]}>
                  {isAttended ? 'Atendida' : 'Eliminada'}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.alertDescription}>{alert.description}</Text>
        </View>
      </View>

      {/* Detalles */}
      <View style={styles.alertDetails}>
        <DetailItem label="Dirección" value={alert.address} />
        {alert.district && <DetailItem label="Distrito" value={alert.district} />}
        {alert.beat && <DetailItem label="Beat" value={alert.beat} />}
        <DetailItem
          label="Confirmada por"
          value={`${alert.confirmations ?? 0} usuario${alert.confirmations !== 1 ? 's' : ''}`}
        />
        <DetailItem
          label="Descartada por"
          value={`${alert.discards ?? 0} usuario${alert.discards !== 1 ? 's' : ''}`}
        />
      </View>

      {/* Acciones según rol/estado */}
      {isPending && !hasActed && !isStaff && (
        <View style={styles.alertActions}>
          <Button
            title="Descartar"
            icon="trash"
            variant="danger"
            style={styles.actionButton}
            onPress={() => onDiscard && onDiscard(alert._id)}
          />
          <Button
            title="Confirmar"
            icon="check"
            variant="success"
            style={styles.actionButton}
            onPress={() => onConfirm && onConfirm(alert._id)}
          />
        </View>
      )}

      {/* Banner "actuado por mí" — reemplaza los botones */}
      {hasActed && (
        <View style={[
          styles.myActionBanner,
          confirmedByMe ? styles.myActionBannerConfirmed : styles.myActionBannerDiscarded
        ]}>
          <FontAwesome
            name={confirmedByMe ? 'check-circle' : 'times-circle'}
            size={15}
            color={confirmedByMe ? theme.colors.success : theme.colors.danger}
          />
          <Text style={[
            styles.myActionText,
            { color: confirmedByMe ? theme.colors.success : theme.colors.danger }
          ]}>
            {confirmedByMe ? 'Confirmada por mí' : 'Descartada por mí'}
          </Text>
        </View>
      )}

      {/* Acciones de admin (atender/eliminar) para alertas pendientes sin acción propia */}
      {isPending && !hasActed && (onDelete || onAttend) && (
        <View style={[styles.alertActions, { marginTop: 8 }]}>
          {onDelete && (
            <Button
              title="Eliminar"
              icon="trash"
              variant="danger"
              style={styles.actionButton}
              onPress={() => onDelete(alert._id)}
            />
          )}
          {onAttend && (
            <Button
              title="Atender"
              icon="check"
              variant="success"
              style={styles.actionButton}
              onPress={() => onAttend(alert._id)}
            />
          )}
        </View>
      )}
    </View>
  );
}

/**
 * Item de detalle (label: valor)
 */
const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}: </Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    width: '100%',
  },
  alertCardMobile: {
    width: '100%',
  },
  attendedCard: {
    borderColor: theme.colors.success + '40',
    backgroundColor: theme.colors.success + '05',
  },
  deletedCard: {
    borderColor: theme.colors.danger + '40',
    backgroundColor: theme.colors.danger + '05',
  },
  confirmedCard: {
    borderColor: theme.colors.success + '40',
    backgroundColor: theme.colors.success + '08',
  },
  discardedCard: {
    borderColor: theme.colors.danger + '40',
    backgroundColor: theme.colors.danger + '08',
  },
  alertCardHeader: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  alertTitle: {
    ...theme.typography.cardTitle,
    color: theme.colors.text,
    fontSize: 18,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radii.sm,
  },
  statusBadgeAttended: {
    backgroundColor: theme.colors.success + '20',
  },
  statusBadgeDeleted: {
    backgroundColor: theme.colors.danger + '20',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  alertDescription: {
    ...theme.typography.body,
    color: theme.colors.cardTextSecondary,
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
  alertDetails: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.cardTextSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.cardTextSecondary,
    fontSize: 13,
  },
  alertActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 40,
  },
  myActionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 10,
  },
  myActionBannerConfirmed: {
    backgroundColor: theme.colors.success + '20',
  },
  myActionBannerDiscarded: {
    backgroundColor: theme.colors.danger + '20',
  },
  myActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
