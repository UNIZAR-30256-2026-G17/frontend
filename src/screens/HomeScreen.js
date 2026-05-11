// HomeScreen.tsx — Versión mejorada
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, useWindowDimensions, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

// ─── DESIGN TOKENS ──────────────────────────────────────────────
const C = {
  yellow:   '#F5C842',
  dark:     '#111111',
  dark2:    '#1e1e1e',
  surface:  '#F7F6F1',
  white:    '#FFFFFF',
  textDark: '#111111',
  textMid:  '#444444',
  textMute: '#888888',
  border:   '#E4E2D8',
};

const SPACE = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40, xxl: 64 };

// Helper: devuelve valor según breakpoint
const rs = (isMobile, mobile, desktop) => isMobile ? mobile : desktop;

// ─── DATA ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: 'map-marker', title: 'Mapa interactivo',
    desc: 'Visualiza índices de criminalidad por distrito y beat en tiempo real.',
    bg: '#E8F4FD', iconColor: '#2a7bc0',
  },
  {
    icon: 'bar-chart', title: 'Estadísticas avanzadas',
    desc: 'Gráficas por distrito, hora y tipo de crimen. Filtra hasta 3 años atrás.',
    bg: '#FEF9EC', iconColor: '#B87C10',
  },
  {
    icon: 'bell', title: 'Sistema de alertas',
    desc: 'Los ciudadanos crean alertas que la policía recibe y gestiona en tiempo real.',
    bg: '#FDF0F0', iconColor: '#C0392B',
  },
  {
    icon: 'road', title: 'Rutas seguras',
    desc: 'Genera rutas evitando zonas con mayor índice de peligrosidad del condado.',
    bg: '#F0FDF4', iconColor: '#1A7A3C',
  },
];

const ROLES = [
  {
    icon: 'user', role: 'Ciudadano', bg: C.yellow, textColor: C.dark,
    perks: ['Ver estadísticas de criminalidad', 'Consultar el mapa de seguridad',
            'Crear alertas de posibles delitos', 'Confirmar alertas de vecinos', 'Generar rutas seguras'],
  },
  {
    icon: 'star', role: 'Policía', bg: C.dark, textColor: '#fff',
    perks: ['Gestionar y atender alertas', 'Ver listado completo de delitos',
            'Filtrar por tipo, fecha, distrito', 'Ver índices por beat', 'Rutas de patrullaje optimizadas'],
  },
  {
    icon: 'shield', role: 'Administrador', bg: '#2a2a2a', textColor: '#fff',
    perks: ['Gestionar usuarios policiales', 'Bloquear / desbloquear agentes',
            'Administrar catálogo de delitos', 'Restaurar o eliminar alertas', 'Control total del sistema'],
  },
];

const STATS = [
  { value: 7,    suffix: '',  label: 'Distritos' },
  { value: 50,   suffix: '+', label: 'Beats monitorizados' },
  { value: 3,    suffix: '',  label: 'Roles de usuario' },
  { value: 98,   suffix: '%', label: 'Uptime del sistema' },
];

// ─── ANIMATED COUNTER ────────────────────────────────────────────
const AnimatedStat = ({ value, suffix, label }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 1200, useNativeDriver: false }).start();
    anim.addListener(({ value: v }) => setDisplay(Math.floor(v)));
    return () => anim.removeAllListeners();
  }, []);

  return (
    <View style={s.statItem}>
      <Text style={s.statValue}>{display}{suffix}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
};

// ─── FADE CARD ───────────────────────────────────────────────────
const FadeCard = ({ children, delay = 0, style }) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 550, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, tension: 60, friction: 10 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};

// ─── SECTION HEADER ──────────────────────────────────────────────
const SectionHeader = ({ tag, title, light = false }) => (
  <View style={s.sectionHeader}>
    <View style={[s.tagPill, light && s.tagPillLight]}>
      <Text style={[s.tagText, light && s.tagTextLight]}>{tag}</Text>
    </View>
    <Text style={[s.sectionTitle, light && s.sectionTitleLight]}>{title}</Text>
  </View>
);

// ─── MAP ILLUSTRATION ────────────────────────────────────────────
const MapIllustration = () => {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const zones = [
    { top: '12%', left: '18%', w: 90,  h: 90,  r: 45, color: 'rgba(220,60,50,0.22)'  },
    { top: '38%', left: '48%', w: 110, h: 110, r: 55, color: 'rgba(240,155,30,0.2)'  },
    { top: '55%', left: '12%', w: 70,  h: 70,  r: 35, color: 'rgba(50,175,90,0.22)'  },
    { top: '18%', left: '60%', w: 85,  h: 85,  r: 42, color: 'rgba(240,155,30,0.18)' },
    { top: '66%', left: '58%', w: 65,  h: 65,  r: 32, color: 'rgba(50,175,90,0.2)'   },
  ];

  const beats = [
    { top: '16%', left: '20%', label: '1A1', color: '#C0392B' },
    { top: '42%', left: '51%', label: '3G2', color: '#B87C10' },
    { top: '57%', left: '15%', label: '5M1', color: '#1A7A3C' },
    { top: '22%', left: '62%', label: '4J3', color: '#B87C10' },
    { top: '69%', left: '60%', label: '6P1', color: '#1A7A3C' },
  ];

  return (
    <View style={il.container}>
      <View style={il.mapBg}>
        {/* Grid */}
        {[20, 40, 60, 80].map(p => (
          <View key={`h${p}`} style={[il.grid, { top: `${p}%`, left: 0, right: 0, height: 1 }]} />
        ))}
        {[25, 50, 75].map(p => (
          <View key={`v${p}`} style={[il.grid, { left: `${p}%`, top: 0, bottom: 0, width: 1 }]} />
        ))}

        {/* Heat zones */}
        {zones.map((z, i) => (
          <View key={i} style={[il.zone, { top: z.top, left: z.left, width: z.w, height: z.h, borderRadius: z.r, backgroundColor: z.color }]} />
        ))}

        {/* Beat badges */}
        {beats.map((b, i) => (
          <View key={i} style={[il.beatBadge, { top: b.top, left: b.left, borderColor: b.color }]}>
            <Text style={[il.beatText, { color: b.color }]}>{b.label}</Text>
          </View>
        ))}

        {/* Pulsing alert pins */}
        {[{ top: '33%', left: '33%', warn: '#C0392B' }, { top: '48%', left: '70%', warn: '#B87C10' }].map((p, i) => (
          <View key={i} style={[il.pinOuter, { top: p.top, left: p.left }]}>
            <Animated.View style={[il.pinPulse, { borderColor: p.warn, transform: [{ scale: i === 0 ? pulse : 1 }] }]} />
            <View style={[il.pinInner, { backgroundColor: p.warn }]}>
              <FontAwesome name="exclamation" size={9} color="#fff" />
            </View>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={il.legend}>
        {[['#C0392B', 'Alto'], ['#E67E22', 'Medio'], ['#27AE60', 'Bajo']].map(([c, l]) => (
          <View key={l} style={il.legendItem}>
            <View style={[il.dot, { backgroundColor: c }]} />
            <Text style={il.legendText}>{l}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────
export const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const m = width < 768; // isMobile shorthand

  const heroOp = useRef(new Animated.Value(0)).current;
  const heroY  = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOp, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(heroY,  { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

      {/* ── HERO ── */}
      <View style={[s.hero, m && s.heroM]}>
        {/* Accent circles */}
        <View style={[s.accent, { width: 400, height: 400, top: -100, right: -80, opacity: 0.06 }]} />
        <View style={[s.accent, { width: 200, height: 200, bottom: -40, left: -40,  opacity: 0.04 }]} />

        {/* Yellow vertical stripe (desktop) */}
        {!m && <View style={s.heroStripe} />}

        <Animated.View style={[s.heroContent, m && s.heroContentM, { opacity: heroOp, transform: [{ translateY: heroY }] }]}>
          {/* Badge */}
          <View style={s.badge}>
            <View style={s.badgeDot} />
            <Text style={s.badgeText}>Condado de Montgomery · Maryland</Text>
          </View>

          <Text style={[s.heroTitle, { fontSize: rs(m, 32, 52) }]}>
            Tu ciudad,{'\n'}más segura
          </Text>

          <Text style={[s.heroSub, { fontSize: rs(m, 15, 17) }]}>
            Consulta la criminalidad en tiempo real, recibe alertas de tu barrio
            y navega por rutas más seguras.
          </Text>

          <View style={[s.ctaRow, m && s.ctaRowM]}>
            <TouchableOpacity style={s.btnYellow} onPress={() => navigation.navigate('Map')} activeOpacity={0.85}>
              <FontAwesome name="map" size={14} color={C.dark} />
              <Text style={s.btnYellowText}>Ver el mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnGhost} onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
              <Text style={s.btnGhostText}>Iniciar sesión</Text>
              <FontAwesome name="arrow-right" size={12} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Illustration */}
        <Animated.View style={[s.heroIll, { width: rs(m, '100%', 340) }, { opacity: heroOp }]}>
          <MapIllustration />
        </Animated.View>
      </View>

      {/* ── STATS BAR ── */}
      <View style={s.statsBar}>
        {STATS.map((st, i) => (
          <React.Fragment key={i}>
            <AnimatedStat {...st} />
            {i < STATS.length - 1 && <View style={s.statDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* ── FEATURES ── */}
      <View style={[s.section, { backgroundColor: C.surface }]}>
        <SectionHeader tag="Funcionalidades" title={`Todo lo que\nnecesitas para estar seguro`} />
        <View style={[s.grid2, m && s.gridCol]}>
          {FEATURES.map((f, i) => (
            <FadeCard key={i} delay={i * 90} style={[s.featureCard, m && s.fullWidth]}>
              <View style={[s.featureIcon, { backgroundColor: f.bg }]}>
                <FontAwesome name={f.icon} size={18} color={f.iconColor} />
              </View>
              <Text style={s.featureTitle}>{f.title}</Text>
              <Text style={s.featureDesc}>{f.desc}</Text>
            </FadeCard>
          ))}
        </View>
      </View>

      {/* ── ROLES ── */}
      <View style={[s.section, { backgroundColor: C.white }]}>
        <SectionHeader tag="Roles" title={`Una plataforma,\ntres perfiles`} />
        <View style={[s.grid3, m && s.gridCol]}>
          {ROLES.map((r, i) => (
            <FadeCard key={i} delay={i * 110} style={[s.roleCard, { backgroundColor: r.bg }, m && s.fullWidth]}>
              <View style={[s.roleIcon, { backgroundColor: r.textColor === '#fff' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
                <FontAwesome name={r.icon} size={18} color={r.textColor} />
              </View>
              <Text style={[s.roleTitle, { color: r.textColor }]}>{r.role}</Text>
              {r.perks.map((p, j) => (
                <View key={j} style={s.perkRow}>
                  <View style={[s.perkDot, { backgroundColor: r.textColor === '#fff' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)' }]} />
                  <Text style={[s.perkText, { color: r.textColor === '#fff' ? 'rgba(255,255,255,0.8)' : C.textMid }]}>{p}</Text>
                </View>
              ))}
            </FadeCard>
          ))}
        </View>
      </View>

      {/* ── AI BANNER ── */}
      <View style={s.aiBanner}>
        <View style={s.aiOrb}>
          <FontAwesome name="bolt" size={20} color={C.dark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.aiTitle}>Impulsado por Inteligencia Artificial</Text>
          <Text style={s.aiDesc}>
            El índice de criminalidad se calcula con modelos de IA entrenados con datos de
            los últimos 3 años, actualizando automáticamente la peligrosidad de cada beat.
          </Text>
        </View>
      </View>

      {/* ── CTA FINAL ── */}
      <View style={[s.ctaSection, m && { paddingVertical: SPACE.xl, paddingHorizontal: SPACE.lg }]}>
        <Text style={[s.ctaTitle, { fontSize: rs(m, 26, 38) }]}>Empieza ahora</Text>
        <Text style={s.ctaDesc}>
          Consulta el mapa sin registrarte, o inicia sesión si eres agente o administrador.
        </Text>
        <View style={[s.ctaRow, m && s.ctaRowM]}>
          <TouchableOpacity style={s.btnYellowDark} onPress={() => navigation.navigate('Map')} activeOpacity={0.85}>
            <FontAwesome name="map" size={14} color={C.white} />
            <Text style={s.btnYellowDarkText}>Explorar el mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnOutline} onPress={() => navigation.navigate('Stats')} activeOpacity={0.7}>
            <FontAwesome name="bar-chart" size={14} color={C.dark} />
            <Text style={s.btnOutlineText}>Ver estadísticas</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── FOOTER ── */}
      <View style={s.footer}>
        <Text style={s.footerMain}>© 2025 Montgomery SafetyMap · Condado de Montgomery</Text>
        <Text style={s.footerSub}>Powered by OpenStreetMap · OSRM · IA predictiva</Text>
      </View>

    </ScrollView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.surface },

  // HERO
  hero: {
    backgroundColor: C.dark, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: SPACE.xl,
    paddingTop: 64, paddingBottom: 0, minHeight: 500, overflow: 'hidden',
  },
  heroM: { flexDirection: 'column', paddingHorizontal: SPACE.lg, paddingTop: SPACE.xl },
  accent: { position: 'absolute', borderRadius: 999, backgroundColor: '#fff' },
  heroStripe: {
    position: 'absolute', right: 280, top: 0, bottom: 0, width: 4,
    backgroundColor: C.yellow, opacity: 0.6,
  },
  heroContent: { flex: 1, maxWidth: 460, paddingBottom: 60 },
  heroContentM: { maxWidth: '100%', paddingBottom: SPACE.lg },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, marginBottom: SPACE.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.yellow },
  badgeText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: 0.3 },

  heroTitle: {
    fontWeight: '800', color: C.white, lineHeight: undefined, marginBottom: SPACE.md,
    letterSpacing: -0.8,
  },
  heroSub: { color: 'rgba(255,255,255,0.55)', lineHeight: 28, marginBottom: SPACE.lg, maxWidth: 400 },

  ctaRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  ctaRowM: { flexDirection: 'column', alignItems: 'flex-start' },

  btnYellow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.yellow,
    paddingHorizontal: 22, paddingVertical: 13, borderRadius: 28,
  },
  btnYellowText: { color: C.dark, fontWeight: '700', fontSize: 15 },

  btnGhost: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 13,
  },
  btnGhostText: { color: 'rgba(255,255,255,0.65)', fontWeight: '600', fontSize: 15 },

  heroIll: { marginLeft: 24, alignSelf: 'flex-end' },

  // STATS
  statsBar: {
    flexDirection: 'row', backgroundColor: C.yellow,
    paddingVertical: SPACE.lg, paddingHorizontal: SPACE.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.12)', marginVertical: 4 },
  statValue: { fontSize: 28, fontWeight: '800', color: C.dark, marginBottom: 3 },
  statLabel: { fontSize: 11, color: 'rgba(0,0,0,0.5)', textAlign: 'center', fontWeight: '600', letterSpacing: 0.2 },

  // SECTION
  section: { paddingVertical: SPACE.xxl, paddingHorizontal: SPACE.lg },
  sectionHeader: { alignItems: 'center', marginBottom: SPACE.xl },
  tagPill: {
    backgroundColor: C.dark, paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 20, marginBottom: 14,
  },
  tagPillLight: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  tagText: { fontSize: 11, fontWeight: '700', color: C.yellow, letterSpacing: 1.2, textTransform: 'uppercase' },
  tagTextLight: { color: C.textMute },
  sectionTitle: { fontSize: 28, fontWeight: '800', color: C.dark, textAlign: 'center', lineHeight: 38, letterSpacing: -0.3 },
  sectionTitleLight: { color: C.white },

  // GRIDS
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.md, justifyContent: 'center' },
  grid3: { flexDirection: 'row', gap: SPACE.md, justifyContent: 'center' },
  gridCol: { flexDirection: 'column' },
  fullWidth: { width: '100%', maxWidth: '100%' },

  // FEATURE CARD
  featureCard: {
    backgroundColor: C.white, borderRadius: 16, padding: SPACE.lg,
    width: '46%', maxWidth: 310, borderWidth: 1, borderColor: C.border,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
    }),
  },
  featureIcon: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: C.dark, marginBottom: 6 },
  featureDesc: { fontSize: 13, color: C.textMute, lineHeight: 21 },

  // ROLE CARD
  roleCard: { flex: 1, borderRadius: 16, padding: SPACE.lg, minWidth: 190, maxWidth: 290 },
  roleIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  roleTitle: { fontSize: 17, fontWeight: '800', marginBottom: 14 },
  perkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  perkDot: { width: 5, height: 5, borderRadius: 3, marginTop: 7, flexShrink: 0 },
  perkText: { fontSize: 13, lineHeight: 20, flex: 1 },

  // AI BANNER
  aiBanner: {
    backgroundColor: C.dark, flexDirection: 'row', alignItems: 'center',
    gap: SPACE.lg, paddingHorizontal: SPACE.xl, paddingVertical: SPACE.xl,
    borderTopWidth: 3, borderTopColor: C.yellow,
  },
  aiOrb: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: C.yellow,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  aiTitle: { fontSize: 17, fontWeight: '800', color: C.white, marginBottom: 6 },
  aiDesc: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 21 },

  // CTA FINAL
  ctaSection: {
    backgroundColor: C.white, alignItems: 'center',
    paddingVertical: SPACE.xxl, paddingHorizontal: SPACE.xl,
  },
  ctaTitle: { fontWeight: '800', color: C.dark, textAlign: 'center', marginBottom: 12, letterSpacing: -0.4 },
  ctaDesc: { fontSize: 15, color: C.textMute, textAlign: 'center', lineHeight: 25, maxWidth: 400, marginBottom: SPACE.lg },

  btnYellowDark: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.dark,
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 28,
  },
  btnYellowDarkText: { color: C.white, fontWeight: '700', fontSize: 15 },

  btnOutline: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'transparent',
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 28,
    borderWidth: 1.5, borderColor: C.border,
  },
  btnOutlineText: { color: C.dark, fontWeight: '700', fontSize: 15 },

  // FOOTER
  footer: {
    backgroundColor: C.surface, alignItems: 'center', paddingVertical: SPACE.lg,
    borderTopWidth: 1, borderTopColor: C.border,
  },
  footerMain: { fontSize: 12, color: C.textMute, fontWeight: '500' },
  footerSub:  { fontSize: 11, color: '#bbb', marginTop: 4 },
});

// ─── MAP ILLUSTRATION STYLES ─────────────────────────────────────
const il = StyleSheet.create({
  container:  { backgroundColor: '#dce8d8', borderRadius: 16, overflow: 'hidden', height: 310 },
  mapBg:      { flex: 1, position: 'relative' },
  grid:       { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.35)' },
  zone:       { position: 'absolute' },
  beatBadge:  { position: 'absolute', borderWidth: 1.5, borderRadius: 6, backgroundColor: '#fff', paddingHorizontal: 6, paddingVertical: 2 },
  beatText:   { fontSize: 10, fontWeight: '700' },
  pinOuter:   { position: 'absolute', width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  pinPulse:   { position: 'absolute', width: 30, height: 30, borderRadius: 15, borderWidth: 2, opacity: 0.4 },
  pinInner:   { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  legend:     { flexDirection: 'row', gap: 14, padding: 10, backgroundColor: 'rgba(255,255,255,0.88)', justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot:        { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: C.textMid, fontWeight: '600' },
});