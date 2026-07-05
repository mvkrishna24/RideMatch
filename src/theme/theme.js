/**
 * RouteMatch Design System — theme.js
 * "Same route. Every day. Together."
 *
 * React Native design token file.
 * Android-first. 8px base grid. Space Grotesk + Inter type stack.
 * Every token here maps to a real product decision — nothing is decorative.
 *
 * Usage: import { theme } from './theme';
 */

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE PALETTE (raw hex values — don't reference these directly in components)
// ─────────────────────────────────────────────────────────────────────────────

const palette = {
  // Blues — trust, institution, system actions
  blue50:  '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue300: '#93C5FD',
  blue400: '#60A5FA',
  blue500: '#3B82F6',
  blue600: '#1A73E8', // ← Primary brand blue
  blue700: '#1D4ED8',
  blue800: '#1E40AF',
  blue900: '#1E3A8A',

  // Orange — energy, warmth, social actions (Indian auto-orange lineage)
  orange50:  '#FFF7ED',
  orange100: '#FFEDD5',
  orange200: '#FED7AA',
  orange300: '#FDBA74',
  orange400: '#FB923C',
  orange500: '#FF6B35', // ← Accent brand orange
  orange600: '#EA580C',
  orange700: '#C2410C',
  orange800: '#9A3412',
  orange900: '#7C2D12',

  // Greens — success, verified, streaks
  green50:  '#F0FDF4',
  green100: '#DCFCE7',
  green200: '#BBF7D0',
  green300: '#86EFAC',
  green400: '#4ADE80',
  green500: '#22C55E',
  green600: '#16A34A', // ← Success green
  green700: '#15803D',
  green800: '#166534',
  green900: '#14532D',

  // Ambers — warnings, score 3.5–4.4
  amber50:  '#FFFBEB',
  amber100: '#FEF3C7',
  amber200: '#FDE68A',
  amber300: '#FCD34D',
  amber400: '#FBBF24',
  amber500: '#F59E0B', // ← Warning amber
  amber600: '#D97706',
  amber700: '#B45309',
  amber800: '#92400E',
  amber900: '#78350F',

  // Reds — errors, destructive, score <3.5
  red50:  '#FEF2F2',
  red100: '#FEE2E2',
  red200: '#FECACA',
  red300: '#FCA5A5',
  red400: '#F87171',
  red500: '#EF4444',
  red600: '#DC2626', // ← Error red
  red700: '#B91C1C',
  red800: '#991B1B',
  red900: '#7F1D1D',

  // Neutrals — surfaces, text, dividers
  neutral0:   '#FFFFFF',
  neutral50:  '#F7F9FC', // ← Surface (off-white)
  neutral100: '#F1F5F9',
  neutral200: '#E2E8F0', // ← Divider
  neutral300: '#CBD5E1',
  neutral400: '#94A3B8',
  neutral500: '#64748B', // ← Text secondary
  neutral600: '#475569',
  neutral700: '#334155',
  neutral800: '#1E293B',
  neutral900: '#0F172A', // ← Dark surface / text primary
  neutral950: '#020617',

  // Deep navy — dark mode surfaces, splash background
  navy900: '#0F172A',
  navy800: '#162032',
  navy700: '#1E2A3B',
  navy600: '#243144',

  // Pure values
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};


// ─────────────────────────────────────────────────────────────────────────────
// SEMANTIC COLOR TOKENS
// These are what components consume. Swap palette values here for theming.
// ─────────────────────────────────────────────────────────────────────────────

const colors = {
  // ── Brand ─────────────────────────────────────────────────────────────────
  /**
   * Primary: #1A73E8 — Google Blue variant
   * Use for: navigation actions, system-level CTAs, links, verified badges
   * Mental model: "The institution. The system. The trustworthy thing."
   */
  primary:        palette.blue600,
  primaryLight:   palette.blue100,
  primaryDark:    palette.blue800,

  /**
   * Accent: #FF6B35 — Indian auto-orange
   * Use for: social actions ("Send Interest", "Accept"), FABs, streaks, active nav
   * Mental model: "Do something social. Connect with someone. Make a move."
   * Rule: If the action creates or deepens a human connection → orange.
   *       If the action navigates or confirms a system state → blue.
   */
  accent:         palette.orange500,
  accentLight:    palette.orange100,
  accentDark:     palette.orange700,

  // ── Surfaces ──────────────────────────────────────────────────────────────
  /**
   * surface: The main app background. Off-white, not stark white.
   * Card backgrounds sit on this. Use neutrals above it for card fills.
   */
  surface:        palette.neutral50,
  surfaceCard:    palette.white,
  surfaceElevated: palette.white,
  surfaceInverse: palette.navy900,
  surfaceDark:    palette.navy900,

  // ── Text ──────────────────────────────────────────────────────────────────
  /**
   * Text follows a 3-level hierarchy. Never go below textTertiary for body.
   * textPrimary: headlines, names, key data
   * textSecondary: supporting text, metadata, placeholders
   * textTertiary: captions, timestamps, fine print
   */
  textPrimary:    palette.neutral900,
  textSecondary:  palette.neutral500,
  textTertiary:   palette.neutral400,
  textInverse:    palette.white,
  textOnPrimary:  palette.white,
  textOnAccent:   palette.white,
  textLink:       palette.blue600,
  textDisabled:   palette.neutral300,

  // ── Semantic States ────────────────────────────────────────────────────────
  success:        palette.green600,
  successLight:   palette.green50,
  successDark:    palette.green800,

  warning:        palette.amber500,
  warningLight:   palette.amber50,
  warningDark:    palette.amber700,

  error:          palette.red600,
  errorLight:     palette.red50,
  errorDark:      palette.red800,

  info:           palette.blue600,
  infoLight:      palette.blue50,

  // ── UI Chrome ─────────────────────────────────────────────────────────────
  divider:        palette.neutral200,
  border:         palette.neutral200,
  borderFocused:  palette.blue600,
  borderError:    palette.red600,

  // ── Overlay & Scrim ───────────────────────────────────────────────────────
  scrim:          'rgba(15, 23, 42, 0.6)',    // navy900 at 60%
  scrimLight:     'rgba(15, 23, 42, 0.3)',
  overlay:        'rgba(255, 255, 255, 0.9)', // white at 90% for floating elements

  // ── Trust & Verification ──────────────────────────────────────────────────
  /**
   * Reliability score coloring:
   * score ≥ 4.5 → reliabilityHigh (green)
   * score 3.5–4.4 → reliabilityMid (amber)
   * score < 3.5 → reliabilityLow (red) — also shows warning banner
   */
  verifiedBadge:     palette.blue600,
  verifiedBadgeBg:   palette.blue50,
  reliabilityHigh:   palette.green600,
  reliabilityMid:    palette.amber500,
  reliabilityLow:    palette.red600,
  streakFlame:       palette.orange500,

  // ── Gender Indicators ─────────────────────────────────────────────────────
  /**
   * Small dot indicators on profile cards. Subtle — never the loudest thing.
   * These only appear on profile/match cards, never as the primary UI element.
   */
  genderMale:     palette.blue400,
  genderFemale:   '#E879C6',            // pink, not in main palette
  genderNeutral:  palette.neutral400,

  // ── Chat Bubbles ──────────────────────────────────────────────────────────
  bubbleSent:     palette.blue600,       // sent: blue bg, white text
  bubbleReceived: palette.neutral100,    // received: light grey bg, dark text

  // ── Navigation ────────────────────────────────────────────────────────────
  navBarBg:           palette.white,
  navIconDefault:     palette.neutral400,
  navIconActive:      palette.orange500,
  navLabelDefault:    palette.neutral400,
  navLabelActive:     palette.orange500,
  navBadge:           palette.red600,

  // ── Skeleton / Loading ────────────────────────────────────────────────────
  skeletonBase:       palette.neutral100,
  skeletonHighlight:  palette.neutral200,

  // ── Gradient Stops (for hero headers) ─────────────────────────────────────
  gradientHeroStart:  palette.blue600,
  gradientHeroEnd:    palette.navy900,

  // ── Splash ────────────────────────────────────────────────────────────────
  splashBg:       palette.navy900,
  splashRoute:    palette.orange500,    // the animated route line
};


// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Font families:
 * - display (Space Grotesk): wordmarks, headlines, scores, numbers with personality
 * - body (Inter): all running text, labels, inputs, everything else
 * - fallback (Noto Sans): Hindi/Telugu script support
 *
 * Registration: Load via @expo-google-fonts or react-native-font-loader.
 * The font family strings below match Expo's naming convention.
 */
const fontFamilies = {
  display:         'SpaceGrotesk',
  displayBold:     'SpaceGrotesk-Bold',
  displaySemiBold: 'SpaceGrotesk-SemiBold',
  displayMedium:   'SpaceGrotesk-Medium',
  displayRegular:  'SpaceGrotesk-Regular',

  body:            'Inter',
  bodyBold:        'Inter-Bold',
  bodySemiBold:    'Inter-SemiBold',
  bodyMedium:      'Inter-Medium',
  bodyRegular:     'Inter-Regular',

  // Fallback for Indic scripts (Telugu/Hindi in UI copy or user bios)
  indic:           'NotoSans',
};

/**
 * Font size scale (px values map to React Native's unitless dp system).
 * All sizes tested against WCAG AA on Android at default font scale.
 * Minimum body text: 14. Minimum caption: 12.
 */
const fontSizes = {
  xs:   10,    // caption fine print, badges
  sm:   12,    // captions, timestamps, meta
  md:   14,    // body text — MINIMUM for readable body copy
  lg:   15,    // body secondary, input placeholder
  xl:   16,    // body primary, input value
  '2xl': 18,   // card titles, section headers
  '3xl': 22,   // screen subheadings
  '4xl': 28,   // screen display headlines (onboarding)
  '5xl': 36,   // score numbers, stat callouts
  '6xl': 48,   // splash wordmark
};

/**
 * Font weights in React Native string format.
 */
const fontWeights = {
  regular:  '400',
  medium:   '500',
  semiBold: '600',
  bold:     '700',
};

/**
 * Line height multipliers.
 * Apply as: lineHeight = fontSize * lineHeights.body
 * Or use the pre-calculated values in the type scale below.
 */
const lineHeights = {
  tight:   1.2,   // display headlines — big and close
  snug:    1.35,  // card titles
  normal:  1.5,   // body text — default for readability
  relaxed: 1.65,  // longer form body copy, bios
  loose:   2.0,   // labels, single-line metadata
};

/**
 * Letter spacing.
 * React Native uses letterSpacing in dp (not em), so these are raw dp values.
 */
const letterSpacings = {
  tighter: -0.5,
  tight:   -0.25,
  normal:   0,
  wide:     0.25,
  wider:    0.5,
  widest:   1.0,   // ALL CAPS labels, badges
};

/**
 * Full typography scale.
 * Every text role in the app maps to one of these. Don't compose ad-hoc styles.
 *
 * Naming: think in terms of the role the text plays, not its size.
 */
const typography = {
  // ── Display (Space Grotesk) ────────────────────────────────────────────────
  /**
   * display1: Wordmarks, splash screen. Only appears in Splash + Onboarding hero.
   */
  display1: {
    fontFamily:    fontFamilies.displayBold,
    fontSize:      fontSizes['6xl'],
    fontWeight:    fontWeights.bold,
    lineHeight:    fontSizes['6xl'] * lineHeights.tight,
    letterSpacing: letterSpacings.tighter,
    color:         colors.textPrimary,
  },

  /**
   * display2: Onboarding slide headlines. Big, warm, campus-energy.
   */
  display2: {
    fontFamily:    fontFamilies.displayBold,
    fontSize:      fontSizes['4xl'],
    fontWeight:    fontWeights.bold,
    lineHeight:    fontSizes['4xl'] * lineHeights.tight,
    letterSpacing: letterSpacings.tight,
    color:         colors.textPrimary,
  },

  /**
   * h1: Screen-level titles (Profile, Settings screen titles)
   */
  h1: {
    fontFamily:    fontFamilies.displayBold,
    fontSize:      fontSizes['3xl'],
    fontWeight:    fontWeights.bold,
    lineHeight:    fontSizes['3xl'] * lineHeights.snug,
    letterSpacing: letterSpacings.tight,
    color:         colors.textPrimary,
  },

  /**
   * h2: Section headings within screens
   */
  h2: {
    fontFamily:    fontFamilies.displaySemiBold,
    fontSize:      fontSizes['2xl'],
    fontWeight:    fontWeights.semiBold,
    lineHeight:    fontSizes['2xl'] * lineHeights.snug,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  /**
   * h3: Card-level headings, match card names
   */
  h3: {
    fontFamily:    fontFamilies.displayMedium,
    fontSize:      fontSizes.xl,
    fontWeight:    fontWeights.semiBold,
    lineHeight:    fontSizes.xl * lineHeights.snug,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  /**
   * statNumber: Reliability scores, ride counts, match percentages.
   * Space Grotesk gives these a geometric authority — they feel like data.
   */
  statNumber: {
    fontFamily:    fontFamilies.displaySemiBold,
    fontSize:      fontSizes['5xl'],
    fontWeight:    fontWeights.semiBold,
    lineHeight:    fontSizes['5xl'] * lineHeights.tight,
    letterSpacing: letterSpacings.tighter,
    color:         colors.textPrimary,
  },

  statNumberMd: {
    fontFamily:    fontFamilies.displaySemiBold,
    fontSize:      fontSizes['2xl'],
    fontWeight:    fontWeights.semiBold,
    lineHeight:    fontSizes['2xl'] * lineHeights.tight,
    letterSpacing: letterSpacings.tight,
    color:         colors.textPrimary,
  },

  // ── Body (Inter) ──────────────────────────────────────────────────────────
  /**
   * body1: Primary readable body copy. Bios, descriptions, notification detail.
   */
  body1: {
    fontFamily:    fontFamilies.bodyRegular,
    fontSize:      fontSizes.xl,
    fontWeight:    fontWeights.regular,
    lineHeight:    fontSizes.xl * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  body1Medium: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      fontSizes.xl,
    fontWeight:    fontWeights.medium,
    lineHeight:    fontSizes.xl * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  body1SemiBold: {
    fontFamily:    fontFamilies.bodySemiBold,
    fontSize:      fontSizes.xl,
    fontWeight:    fontWeights.semiBold,
    lineHeight:    fontSizes.xl * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  /**
   * body2: Secondary body text. Route descriptions, card subtitles.
   * This is the workhorse — 80% of UI text uses body2.
   */
  body2: {
    fontFamily:    fontFamilies.bodyRegular,
    fontSize:      fontSizes.md,
    fontWeight:    fontWeights.regular,
    lineHeight:    fontSizes.md * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  body2Medium: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      fontSizes.md,
    fontWeight:    fontWeights.medium,
    lineHeight:    fontSizes.md * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  body2SemiBold: {
    fontFamily:    fontFamilies.bodySemiBold,
    fontSize:      fontSizes.md,
    fontWeight:    fontWeights.semiBold,
    lineHeight:    fontSizes.md * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  /**
   * subtitle: Input labels, section eyebrows, "You're all set" confirmations
   */
  subtitle: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      fontSizes.lg,
    fontWeight:    fontWeights.medium,
    lineHeight:    fontSizes.lg * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
    color:         colors.textSecondary,
  },

  // ── Label & Utility ───────────────────────────────────────────────────────
  /**
   * label: Form field labels, toggle labels, navigation labels
   * Sentence case, never ALL CAPS (campus-warm tone = no shouting)
   */
  label: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      fontSizes.md,
    fontWeight:    fontWeights.medium,
    lineHeight:    fontSizes.md * lineHeights.loose,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  labelSmall: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      fontSizes.sm,
    fontWeight:    fontWeights.medium,
    lineHeight:    fontSizes.sm * lineHeights.loose,
    letterSpacing: letterSpacings.wide,
    color:         colors.textSecondary,
  },

  /**
   * buttonText: Used inside all button components.
   * SemiBold Inter — not display font. Buttons are actions, not headlines.
   */
  buttonText: {
    fontFamily:    fontFamilies.bodySemiBold,
    fontSize:      fontSizes.lg,
    fontWeight:    fontWeights.semiBold,
    lineHeight:    fontSizes.lg * lineHeights.loose,
    letterSpacing: letterSpacings.normal,
    color:         colors.textInverse,
  },

  buttonTextSm: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      fontSizes.md,
    fontWeight:    fontWeights.medium,
    lineHeight:    fontSizes.md * lineHeights.loose,
    letterSpacing: letterSpacings.normal,
    color:         colors.textInverse,
  },

  /**
   * caption: Timestamps, metadata tails, fine print disclaimers
   */
  caption: {
    fontFamily:    fontFamilies.bodyRegular,
    fontSize:      fontSizes.sm,
    fontWeight:    fontWeights.regular,
    lineHeight:    fontSizes.sm * lineHeights.relaxed,
    letterSpacing: letterSpacings.normal,
    color:         colors.textTertiary,
  },

  captionMedium: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      fontSizes.sm,
    fontWeight:    fontWeights.medium,
    lineHeight:    fontSizes.sm * lineHeights.relaxed,
    letterSpacing: letterSpacings.normal,
    color:         colors.textTertiary,
  },

  /**
   * micro: Badge text, unread counts, verified chip text
   */
  micro: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      fontSizes.xs,
    fontWeight:    fontWeights.medium,
    lineHeight:    fontSizes.xs * lineHeights.loose,
    letterSpacing: letterSpacings.wider,
    color:         colors.textTertiary,
  },

  /**
   * navLabel: Bottom nav bar labels
   */
  navLabel: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      10,
    fontWeight:    fontWeights.medium,
    lineHeight:    14,
    letterSpacing: letterSpacings.normal,
    color:         colors.navLabelDefault,
  },

  /**
   * inputValue: Text the user types into inputs
   */
  inputValue: {
    fontFamily:    fontFamilies.bodyRegular,
    fontSize:      fontSizes.xl,
    fontWeight:    fontWeights.regular,
    lineHeight:    fontSizes.xl * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  /**
   * inputPlaceholder: Placeholder text in all inputs
   */
  inputPlaceholder: {
    fontFamily:    fontFamilies.bodyRegular,
    fontSize:      fontSizes.xl,
    fontWeight:    fontWeights.regular,
    lineHeight:    fontSizes.xl * lineHeights.normal,
    letterSpacing: letterSpacings.normal,
    color:         colors.textTertiary,
  },

  /**
   * chipText: Route chips, day-selector chips, tag chips
   */
  chipText: {
    fontFamily:    fontFamilies.bodyMedium,
    fontSize:      fontSizes.sm,
    fontWeight:    fontWeights.medium,
    lineHeight:    fontSizes.sm * lineHeights.loose,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },

  /**
   * messageText: Chat bubble text
   */
  messageText: {
    fontFamily:    fontFamilies.bodyRegular,
    fontSize:      fontSizes.md,
    fontWeight:    fontWeights.regular,
    lineHeight:    fontSizes.md * lineHeights.relaxed,
    letterSpacing: letterSpacings.normal,
    color:         colors.textPrimary,
  },
};


// ─────────────────────────────────────────────────────────────────────────────
// SPACING SYSTEM
// Base unit: 8px. Every spacing value is a multiple of 8 (or 4 for tight fits).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Spacing scale.
 * Named s4 → s64 (the number is the dp value).
 * s4 and s6 are "half-grid" values for tight icon padding and insets.
 *
 * Usage pattern:
 *   padding: spacing.s16          → 16dp
 *   marginBottom: spacing.s24     → 24dp
 *   gap: spacing.s8               → 8dp
 */
const spacing = {
  s2:   2,    // hairline — divider, border adjustments only
  s4:   4,    // icon internal padding, badge inset
  s6:   6,    // chip vertical padding
  s8:   8,    // tight gaps between inline elements
  s10:  10,   // icon touch target padding (min 44px = 10 + 24icon + 10)
  s12:  12,   // card internal section gaps
  s16:  16,   // standard card padding (horizontal)
  s20:  20,   // between card and screen edge (screen horizontal margin)
  s24:  24,   // section spacing within a screen
  s28:  28,   // modal internal top padding
  s32:  32,   // between major sections
  s40:  40,   // large section gaps, hero padding
  s48:  48,   // screen-level top padding (below status bar)
  s56:  56,   // button height (primary, full-width)
  s64:  64,   // bottom safe area padding, bottom nav height
  s80:  80,   // profile avatar sizes
  s96:  96,   // hero avatar, large profile photo
};

/**
 * Layout constants — not dynamic spacing, but fixed dimensions.
 * These are reference values for component sizing.
 */
const layout = {
  screenWidth:       390,   // Android reference width (dp)
  screenHeight:      844,   // Android reference height (dp)

  // Safe areas (override with react-native-safe-area-context in production)
  statusBarHeight:   24,    // dp — Android typical (varies by device)
  navBarHeight:      32,    // Android gesture nav bar

  // Navigation
  bottomNavHeight:   60,    // the tab bar itself
  topBarHeight:      56,    // app bar / top navigation

  // Touch targets (WCAG minimum 44×44dp)
  touchTargetMin:    44,
  touchTargetSm:     48,
  touchTargetMd:     56,
  touchTargetLg:     64,

  // Avatars
  avatarXs:   24,
  avatarSm:   32,
  avatarMd:   48,    // match cards
  avatarLg:   64,
  avatarXl:   96,    // profile header

  // Cards
  cardHorizontalPad: 16,
  cardVerticalPad:   16,
  screenHorizontalPad: 20,

  // Bottom sheets
  bottomSheetHandleWidth:  40,
  bottomSheetHandleHeight:  4,

  // Input
  inputHeight: 56,
  inputPadH:   16,
  inputPadV:   14,
};


// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADIUS TOKENS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Border radius values.
 * These are deliberately varied — not a single value applied everywhere.
 * The variation encodes hierarchy: cards are softer, inputs are medium, chips are tighter.
 */
const borderRadius = {
  none:   0,
  xs:     4,    // small badges, micro chips
  sm:     8,    // chips (route, day, status), tags
  md:     12,   // inputs, text fields, search bars
  lg:     16,   // cards (match card, profile card, notification card)
  xl:     20,   // modals, bottom sheets
  '2xl':  24,   // FAB, primary action buttons
  full:   9999, // pills (gender selector), avatar rings, unread count badges
};


// ─────────────────────────────────────────────────────────────────────────────
// SHADOW / ELEVATION TOKENS
// React Native uses elevation (Android) + shadow* props (iOS).
// These tokens pair the two for cross-platform use.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shadow levels.
 *
 * sm:  Default card elevation. Barely perceptible — just lifts off the surface.
 * md:  Focused card, floating filter chip, tooltip.
 * lg:  Modals, bottom sheets, FAB.
 * xl:  Full-screen overlays with depth illusion.
 *
 * Apply as a spread: { ...shadows.sm }
 */
const shadows = {
  none: {
    elevation:        0,
    shadowColor:      'transparent',
    shadowOffset:     { width: 0, height: 0 },
    shadowOpacity:    0,
    shadowRadius:     0,
  },
  sm: {
    elevation:        2,
    shadowColor:      palette.navy900,
    shadowOffset:     { width: 0, height: 1 },
    shadowOpacity:    0.06,
    shadowRadius:     4,
  },
  md: {
    elevation:        4,
    shadowColor:      palette.navy900,
    shadowOffset:     { width: 0, height: 4 },
    shadowOpacity:    0.10,
    shadowRadius:     12,
  },
  lg: {
    elevation:        8,
    shadowColor:      palette.navy900,
    shadowOffset:     { width: 0, height: 8 },
    shadowOpacity:    0.14,
    shadowRadius:     24,
  },
  xl: {
    elevation:        16,
    shadowColor:      palette.navy900,
    shadowOffset:     { width: 0, height: 16 },
    shadowOpacity:    0.18,
    shadowRadius:     40,
  },

  // Colored shadow for accent buttons (subtle orange glow on FAB)
  accentGlow: {
    elevation:        6,
    shadowColor:      palette.orange500,
    shadowOffset:     { width: 0, height: 4 },
    shadowOpacity:    0.30,
    shadowRadius:     12,
  },

  // Colored shadow for primary blue buttons
  primaryGlow: {
    elevation:        4,
    shadowColor:      palette.blue600,
    shadowOffset:     { width: 0, height: 4 },
    shadowOpacity:    0.24,
    shadowRadius:     10,
  },
};


// ─────────────────────────────────────────────────────────────────────────────
// Z-INDEX LAYERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Z-index stacking order.
 * React Native's zIndex behaves like CSS z-index within a stacking context.
 * Assign these to views that need controlled layering.
 */
const zIndex = {
  base:         0,    // default content layer
  raised:       10,   // cards that need to overlap dividers
  dropdown:     100,  // autocomplete dropdowns, menus
  sticky:       200,  // sticky headers, sticky bottom bars
  nav:          300,  // bottom navigation bar
  fab:          400,  // floating action button (sits above nav)
  overlay:      500,  // scrim behind modals
  modal:        600,  // modal / bottom sheet content
  toast:        700,  // toast notifications (above modals)
  coachMark:    800,  // onboarding coach marks
  topmost:      900,  // loading overlays, critical alerts
};


// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION / MOTION TOKENS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Animation timing tokens.
 * Apply via Animated.timing() duration or react-native-reanimated withTiming().
 *
 * Philosophy: subtle and purposeful.
 * - State changes (input focus, button press): fast (100–200ms)
 * - Content reveals (card entrance, tab switch): medium (200–300ms)
 * - Page transitions: medium-slow (300ms)
 * - Celebration moments (match found): can be slower (400–600ms)
 */
const animation = {
  durationFast:       100,  // button press state, ripple
  durationNormal:     200,  // card state change, tab switch, input focus
  durationMedium:     300,  // screen entrance, bottom sheet open
  durationSlow:       400,  // celebration animation, match found reveal
  durationVerySlow:   600,  // streak milestone, route-drawing animation

  // Easing presets (use with Animated.timing easing parameter)
  // Import: import { Easing } from 'react-native'
  easingStandard:     'ease-in-out',  // most UI transitions
  easingDecelerate:   'ease-out',     // elements entering the screen
  easingAccelerate:   'ease-in',      // elements leaving the screen
  easingSharp:        'linear',       // precise state changes

  // Spring config (for card entrances — use with react-native-reanimated withSpring)
  springCard: {
    damping:   18,
    stiffness: 200,
    mass:       1,
  },
  springFAB: {
    damping:   14,
    stiffness: 180,
    mass:       0.8,
  },
};


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT-SPECIFIC TOKENS
// Pre-composed token sets for the most common components.
// These derive from the primitives above — no raw values here.
// ─────────────────────────────────────────────────────────────────────────────

const components = {
  // ── Button Variants ───────────────────────────────────────────────────────
  /**
   * CTA color rule:
   * orange (accent) = social action: connecting with a person, sending interest,
   *   accepting a ride request, starting a chat for the first time.
   * blue (primary) = navigation/system action: next step in onboarding, verify,
   *   save settings, confirm route, apply filters.
   * Use this rule every time a new CTA is added to the product.
   */
  button: {
    // Primary — blue. System actions, navigation, forms.
    primary: {
      backgroundColor:  colors.primary,
      color:            colors.textInverse,
      height:           layout.touchTargetMd,         // 56dp
      borderRadius:     borderRadius['2xl'],           // 24dp — rounded but not pill
      paddingHorizontal: spacing.s24,
      ...shadows.primaryGlow,
    },
    primaryDisabled: {
      backgroundColor:  palette.neutral200,
      color:            colors.textDisabled,
    },
    primaryLoading: {
      backgroundColor:  palette.blue400,
      color:            colors.textInverse,
    },

    // Accent — orange. Social actions, connections, interest signals.
    accent: {
      backgroundColor:  colors.accent,
      color:            colors.textInverse,
      height:           layout.touchTargetMd,
      borderRadius:     borderRadius['2xl'],
      paddingHorizontal: spacing.s24,
      ...shadows.accentGlow,
    },
    accentDisabled: {
      backgroundColor:  palette.orange200,
      color:            palette.white,
    },

    // Outline — for secondary actions paired with a primary CTA
    outline: {
      backgroundColor:  colors.transparent,
      color:            colors.primary,
      borderColor:      colors.primary,
      borderWidth:      1.5,
      height:           layout.touchTargetMd,
      borderRadius:     borderRadius['2xl'],
      paddingHorizontal: spacing.s24,
    },
    outlineAccent: {
      backgroundColor:  colors.transparent,
      color:            colors.accent,
      borderColor:      colors.accent,
      borderWidth:      1.5,
      height:           layout.touchTargetMd,
      borderRadius:     borderRadius['2xl'],
      paddingHorizontal: spacing.s24,
    },
    outlineDestructive: {
      backgroundColor:  colors.transparent,
      color:            colors.error,
      borderColor:      colors.error,
      borderWidth:      1.5,
      height:           layout.touchTargetMd,
      borderRadius:     borderRadius['2xl'],
      paddingHorizontal: spacing.s24,
    },

    // Destructive — delete, block, report
    destructive: {
      backgroundColor:  colors.error,
      color:            colors.textInverse,
      height:           layout.touchTargetMd,
      borderRadius:     borderRadius['2xl'],
      paddingHorizontal: spacing.s24,
    },

    // Ghost — text-only, no border or fill. "Skip", "I'll do this later"
    ghost: {
      backgroundColor:  colors.transparent,
      color:            colors.textSecondary,
      height:           layout.touchTargetSm,
      paddingHorizontal: spacing.s16,
    },
    ghostPrimary: {
      backgroundColor:  colors.transparent,
      color:            colors.primary,
      height:           layout.touchTargetSm,
      paddingHorizontal: spacing.s16,
    },
    ghostAccent: {
      backgroundColor:  colors.transparent,
      color:            colors.accent,
      height:           layout.touchTargetSm,
      paddingHorizontal: spacing.s16,
    },

    // Small variant — for action rows inside cards
    sm: {
      height:            layout.touchTargetSm,     // 48dp
      paddingHorizontal: spacing.s16,
      borderRadius:      borderRadius.lg,           // 16dp — slightly tighter
    },

    // FAB — floating action, orange. Filter, compose.
    fab: {
      width:            56,
      height:           56,
      borderRadius:     borderRadius.full,
      backgroundColor:  colors.accent,
      ...shadows.accentGlow,
    },
  },

  // ── Input Variants ────────────────────────────────────────────────────────
  input: {
    default: {
      height:            layout.inputHeight,          // 56dp
      borderRadius:      borderRadius.md,             // 12dp
      borderWidth:       1.5,
      borderColor:       colors.border,
      backgroundColor:   colors.surfaceCard,
      paddingHorizontal: layout.inputPadH,
      paddingVertical:   layout.inputPadV,
    },
    focused: {
      borderColor:  colors.borderFocused,
      backgroundColor: palette.blue50,
    },
    error: {
      borderColor:     colors.borderError,
      backgroundColor: palette.red50,
    },
    disabled: {
      borderColor:     colors.border,
      backgroundColor: palette.neutral100,
      opacity:         0.6,
    },
    search: {
      height:            layout.touchTargetMd,
      borderRadius:      borderRadius.full,           // pill-shaped search bar
      borderWidth:       0,
      backgroundColor:   palette.neutral100,
      paddingHorizontal: spacing.s16,
    },
  },

  // ── Card Variants ─────────────────────────────────────────────────────────
  card: {
    default: {
      backgroundColor:   colors.surfaceCard,
      borderRadius:      borderRadius.lg,             // 16dp
      padding:           layout.cardHorizontalPad,
      marginHorizontal:  layout.screenHorizontalPad,
      ...shadows.sm,
    },
    elevated: {
      backgroundColor:   colors.surfaceCard,
      borderRadius:      borderRadius.lg,
      padding:           layout.cardHorizontalPad,
      ...shadows.md,
    },
    // Match card — slightly taller due to route visualization
    match: {
      backgroundColor:   colors.surfaceCard,
      borderRadius:      borderRadius.lg,
      padding:           spacing.s16,
      marginHorizontal:  layout.screenHorizontalPad,
      marginBottom:      spacing.s12,
      ...shadows.sm,
    },
    // Flat — no shadow, used inside lists
    flat: {
      backgroundColor:   colors.surfaceCard,
      borderRadius:      borderRadius.lg,
      padding:           spacing.s16,
      borderWidth:       1,
      borderColor:       colors.divider,
    },
  },

  // ── Chip Variants ─────────────────────────────────────────────────────────
  chip: {
    // Day selector, route endpoint, match percentage
    default: {
      borderRadius:      borderRadius.sm,             // 8dp
      paddingHorizontal: spacing.s12,
      paddingVertical:   spacing.s6,
      backgroundColor:   palette.neutral100,
    },
    active: {
      backgroundColor:   colors.accentLight,
      borderColor:       colors.accent,
      borderWidth:       1.5,
    },
    verified: {
      backgroundColor:   colors.primaryLight,
      borderColor:       colors.primary,
      borderWidth:       1,
    },
    success: {
      backgroundColor:   colors.successLight,
      borderColor:       colors.success,
      borderWidth:       1,
    },
    // Day selector chip (Mon Tue Wed etc.)
    day: {
      width:             40,
      height:            40,
      borderRadius:      borderRadius.full,
      backgroundColor:   palette.neutral100,
      alignItems:        'center',
      justifyContent:    'center',
    },
    dayActive: {
      backgroundColor:   colors.accent,
    },
    // Route endpoint chip (Kukatpally, JNTUH)
    route: {
      borderRadius:      borderRadius.sm,
      paddingHorizontal: spacing.s8,
      paddingVertical:   spacing.s4,
      backgroundColor:   palette.neutral100,
      flexShrink:        1,
    },
  },

  // ── Avatar ────────────────────────────────────────────────────────────────
  avatar: {
    xs:  { width: layout.avatarXs,  height: layout.avatarXs,  borderRadius: layout.avatarXs  / 2 },
    sm:  { width: layout.avatarSm,  height: layout.avatarSm,  borderRadius: layout.avatarSm  / 2 },
    md:  { width: layout.avatarMd,  height: layout.avatarMd,  borderRadius: layout.avatarMd  / 2 },
    lg:  { width: layout.avatarLg,  height: layout.avatarLg,  borderRadius: layout.avatarLg  / 2 },
    xl:  { width: layout.avatarXl,  height: layout.avatarXl,  borderRadius: layout.avatarXl  / 2 },

    // White ring border for hero profiles (profile screen header)
    heroRing: {
      borderWidth:  3,
      borderColor:  colors.textInverse,
    },
  },

  // ── Bottom Navigation ─────────────────────────────────────────────────────
  bottomNav: {
    container: {
      height:          layout.bottomNavHeight,
      backgroundColor: colors.navBarBg,
      borderTopWidth:  1,
      borderTopColor:  colors.divider,
      ...shadows.md,
    },
    tab: {
      flex:            1,
      alignItems:      'center',
      justifyContent:  'center',
      paddingVertical: spacing.s8,
    },
    iconSize:           24,
    iconDefault:        colors.navIconDefault,
    iconActive:         colors.navIconActive,
    badge: {
      minWidth:         18,
      height:           18,
      borderRadius:     borderRadius.full,
      backgroundColor:  colors.navBadge,
      paddingHorizontal: spacing.s4,
      alignItems:       'center',
      justifyContent:   'center',
      position:         'absolute',
      top:              4,
      right:            8,
    },
  },

  // ── Bottom Sheet ──────────────────────────────────────────────────────────
  bottomSheet: {
    container: {
      backgroundColor: colors.surfaceCard,
      borderTopLeftRadius:  borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      paddingHorizontal:    spacing.s20,
      paddingTop:           spacing.s16,
      paddingBottom:        spacing.s32,
      ...shadows.xl,
    },
    handle: {
      width:           layout.bottomSheetHandleWidth,
      height:          layout.bottomSheetHandleHeight,
      borderRadius:    borderRadius.full,
      backgroundColor: palette.neutral300,
      alignSelf:       'center',
      marginBottom:    spacing.s20,
    },
  },

  // ── Toast Notifications ───────────────────────────────────────────────────
  toast: {
    container: {
      borderRadius:      borderRadius.lg,
      paddingHorizontal: spacing.s16,
      paddingVertical:   spacing.s12,
      marginHorizontal:  spacing.s20,
      flexDirection:     'row',
      alignItems:        'center',
      gap:               spacing.s12,
      ...shadows.lg,
    },
    success: { backgroundColor: palette.green600 },
    error:   { backgroundColor: palette.red600 },
    info:    { backgroundColor: palette.blue600 },
    warning: { backgroundColor: palette.amber500 },
    // Inverted (on dark backgrounds)
    light: {
      backgroundColor: colors.surfaceCard,
      borderWidth:     1,
      borderColor:     colors.divider,
    },
  },

  // ── Reliability Score ─────────────────────────────────────────────────────
  /**
   * Reliability score display rules.
   * Score thresholds and their visual treatment — used consistently across
   * match cards, profile views, and ratings screens.
   */
  reliabilityScore: {
    high: {
      threshold:   4.5,
      color:       colors.reliabilityHigh,
      bgColor:     colors.successLight,
      label:       'Excellent',
    },
    mid: {
      threshold:   3.5,
      color:       colors.reliabilityMid,
      bgColor:     colors.warningLight,
      label:       'Good',
    },
    low: {
      threshold:   0,
      color:       colors.reliabilityLow,
      bgColor:     colors.errorLight,
      label:       'Building',
    },
  },

  // ── Verified Badge ────────────────────────────────────────────────────────
  verifiedBadge: {
    size:            18,
    borderRadius:    borderRadius.full,
    backgroundColor: colors.verifiedBadge,
    iconColor:       colors.textInverse,
    iconSize:        12,
    // Position: absolute, bottom-right of avatar
    position:  'absolute',
    bottom:    0,
    right:     -2,
  },

  // ── Progress Bar ──────────────────────────────────────────────────────────
  progressBar: {
    track: {
      height:          4,
      borderRadius:    borderRadius.full,
      backgroundColor: palette.neutral200,
    },
    fill: {
      height:          4,
      borderRadius:    borderRadius.full,
      backgroundColor: colors.accent,
    },
  },

  // ── Skeleton Loading ──────────────────────────────────────────────────────
  /**
   * Skeleton loaders for all network-dependent screens.
   * Use react-native-reanimated shared value looping between
   * skeletonBase and skeletonHighlight.
   */
  skeleton: {
    base: {
      borderRadius:    borderRadius.sm,
      backgroundColor: colors.skeletonBase,
    },
    highlight: colors.skeletonHighlight,
    animationDuration: 1200,  // ms for one shimmer pass
  },

  // ── Safety Banner ─────────────────────────────────────────────────────────
  safetyBanner: {
    backgroundColor: palette.amber50,
    borderColor:     palette.amber200,
    borderWidth:     1,
    borderRadius:    borderRadius.md,
    padding:         spacing.s12,
    flexDirection:   'row',
    alignItems:      'flex-start',
    gap:             spacing.s8,
  },

  // ── Match Quality Banner ──────────────────────────────────────────────────
  matchQualityBanner: {
    backgroundColor: palette.blue50,
    borderColor:     palette.blue200,
    borderWidth:     1,
    borderRadius:    borderRadius.md,
    padding:         spacing.s12,
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing.s8,
    marginHorizontal: layout.screenHorizontalPad,
    marginBottom:    spacing.s12,
  },
};


// ─────────────────────────────────────────────────────────────────────────────
// DARK MODE OVERRIDES
// Flat map of tokens that change in dark mode.
// Apply with: const c = darkMode ? dark.colors : colors
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dark mode color overrides.
 * The strategy: invert surfaces, keep brand colors (blue/orange), lower contrast
 * slightly so the app doesn't feel harsh at night (common use case: checking
 * matches before bed, planning morning commute in a dark room).
 */
const darkColors = {
  ...colors,

  // Surfaces flip to deep navy
  surface:        palette.navy900,
  surfaceCard:    palette.navy800,
  surfaceElevated: palette.navy700,

  // Text softens slightly (avoid pure white on dark — too much contrast)
  textPrimary:    '#E2E8F0',     // not pure white
  textSecondary:  '#94A3B8',
  textTertiary:   '#64748B',
  textInverse:    palette.navy900,

  // Dividers become lighter navy lines
  divider:        palette.navy600,
  border:         palette.navy600,

  // Nav bar
  navBarBg:       palette.navy900,

  // Chat bubbles
  bubbleReceived: palette.navy700,

  // Scrim (slightly less dark on dark bg)
  scrim: 'rgba(0, 0, 0, 0.7)',

  // Skeleton
  skeletonBase:      palette.navy800,
  skeletonHighlight: palette.navy700,
};


// ─────────────────────────────────────────────────────────────────────────────
// ICON USAGE MAP
// Canonical Phosphor icon names for every recurring UI element.
// All icons used at 24dp unless noted. Import from 'phosphor-react-native'.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Icon registry.
 * Usage: import { MapPin } from 'phosphor-react-native';
 * Rule: Always use the 'Regular' weight as default. 'Fill' for active/selected.
 */
const icons = {
  // Navigation (bottom bar)
  navHome:        'House',            // 24dp — Regular default, Fill when active
  navExplore:     'MagnifyingGlass',  // 24dp
  navMyRides:     'ArrowsLeftRight',  // 24dp — two arrows = mutual ride
  navMessages:    'ChatCircle',       // 24dp
  navProfile:     'UserCircle',       // 24dp

  // Route & Location
  locationFrom:   'MapPin',           // 20dp — inside input fields
  locationTo:     'Flag',             // 20dp
  routeArrow:     'ArrowRight',       // 16dp — between route chips
  mapView:        'MapTrifold',       // 24dp

  // Vehicles
  bike:           'Motorcycle',       // 20dp — match card vehicle indicator
  car:            'Car',              // 20dp
  scooty:         'Scooter',          // 20dp
  noVehicle:      'PersonSimpleRun',  // 20dp

  // Trust & Verification
  verified:       'SealCheck',        // Fill variant — verified badge
  reliability:    'Star',             // Fill when score shown
  streak:         'Fire',             // Fill, colored orange — streak indicator
  shield:         'ShieldCheck',      // 24dp — safety/privacy section

  // Profile
  camera:         'Camera',           // Photo upload
  user:           'User',             // Generic user
  genderMale:     'GenderMale',       // 14dp dot indicator
  genderFemale:   'GenderFemale',     // 14dp dot indicator

  // Ride Actions
  sendInterest:   'PaperPlaneTilt',   // 24dp — "Send Interest" CTA icon
  accept:         'CheckCircle',      // 20dp — accept request
  decline:        'XCircle',          // 20dp — decline request
  cancel:         'X',                // 16dp
  connect:        'HandshakeIcon',    // 20dp — connected state

  // Chat
  chatSend:       'ArrowRight',       // 24dp — inside send button, Fill
  attachment:     'Paperclip',        // 20dp
  routeShare:     'MapPin',           // 20dp — route card in chat
  onlineIndicator: 'Circle',          // 8dp Fill, green

  // Notifications
  notifMatch:     'Target',           // 24dp — new match
  notifMessage:   'ChatCircleText',   // 24dp
  notifAccept:    'CheckCircle',      // 24dp
  notifRating:    'Star',             // 24dp
  notifReminder:  'Bell',             // 24dp
  notifNew:       'Sparkle',          // 24dp — new riders joined

  // Misc UI
  filter:         'SlidersHorizontal',// 24dp — filter FAB
  search:         'MagnifyingGlass',  // 20dp — inside search bar
  back:           'CaretLeft',        // 24dp — back navigation
  close:          'X',                // 24dp — modal close
  more:           'DotsThreeVertical',// 20dp — overflow menu
  info:           'Info',             // 20dp — info icon in chat header
  externalLink:   'ArrowSquareOut',   // 16dp — LinkedIn, Instagram
  edit:           'PencilSimple',     // 20dp
  notification:   'Bell',             // 24dp — top bar

  // Empty States
  emptyRide:      'Road',
  emptyMessage:   'ChatCircle',
  emptyMatch:     'UsersThree',
  emptyNotif:     'BellSlash',

  // Error States
  errorNetwork:   'WifiSlash',
  errorServer:    'CloudSlash',
  error404:       'MapPinSlash',

  // Time & Calendar
  clock:          'Clock',            // 20dp — departure time
  calendar:       'Calendar',         // 20dp
  flexTime:       'ArrowsClockwise',  // 16dp — flex timing toggle

  // Social
  instagram:      'InstagramLogo',    // 20dp
  linkedin:       'LinkedinLogo',     // 20dp

  // Safety
  report:         'WarningCircle',    // 20dp — report user
  emergency:      'Phone',            // 20dp — emergency contact
  lock:           'Lock',             // 16dp — privacy, safety banner
};

/**
 * Icon sizes (dp values).
 * Not all icons need to be 24dp — these are the canonical sizes per context.
 */
const iconSizes = {
  xs:   12,   // badge, micro chip
  sm:   16,   // inline with caption text, inside chips
  md:   20,   // inside input fields, card secondary actions
  lg:   24,   // navigation icons, primary actions, top bar
  xl:   32,   // empty state icons
  '2xl': 48,  // large illustration-level icons in empty/error states
};


// ─────────────────────────────────────────────────────────────────────────────
// GRADIENT DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const gradients = {
  // Hero profile header (profile screen, match profile view)
  hero: {
    colors: [palette.blue600, palette.navy900],
    start:  { x: 0.0, y: 0.0 },
    end:    { x: 0.3, y: 1.0 },
  },

  // Splash screen accent (subtle warm glow over dark)
  splash: {
    colors: [palette.navy900, palette.navy800],
    start:  { x: 0.0, y: 0.0 },
    end:    { x: 0.0, y: 1.0 },
  },

  // Match card percentage badge (high match = warm gradient)
  matchHigh: {
    colors: [palette.green600, '#0E9F5A'],
    start:  { x: 0.0, y: 0.0 },
    end:    { x: 1.0, y: 0.0 },
  },

  // Onboarding slide background (very subtle)
  onboarding: {
    colors: [palette.neutral50, palette.white],
    start:  { x: 0.0, y: 0.0 },
    end:    { x: 0.0, y: 1.0 },
  },

  // FAB subtle glow (bottom of screen)
  fabGlow: {
    colors: ['transparent', 'rgba(255, 107, 53, 0.08)'],
    start:  { x: 0.0, y: 0.0 },
    end:    { x: 0.0, y: 1.0 },
  },
};


// ─────────────────────────────────────────────────────────────────────────────
// MICRO-INTERACTION NOTES
// Not code — but design decisions that must be implemented consistently.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Micro-interaction specifications.
 *
 * Match Found Celebration:
 *   1. Orange confetti burst (30 particles, 400ms)
 *   2. Match card scales from 0.9 → 1.0 with spring (springCard config)
 *   3. "🎯 Strong match found" banner slides in from top, 200ms ease-out
 *   4. Haptic: medium impact (react-native-haptic-feedback)
 *
 * Acceptance Animation (they accepted your request):
 *   1. Card border flashes accent color (2 pulses, 150ms each)
 *   2. Icon transitions: "Interest Sent ✓" → CheckCircle Fill, green
 *   3. Status chip transitions: "Pending" → "Active Ride Partner" (green)
 *   4. Haptic: success (notificationSuccess)
 *
 * Rating Submission:
 *   1. Stars animate in sequence (left → right, 50ms stagger)
 *   2. Quick tags bounce in after stars (spring, 20ms stagger each)
 *   3. Submit button: scale 0.96 → 1.0 on press, then check icon swap
 *   4. Toast: "Rating sent 🎉" slides in from bottom, auto-dismiss 3s
 *   5. Haptic: light impact on each star tap
 *
 * Streak Milestone (7-day, 14-day, 30-day):
 *   1. Streak badge scales 1.0 → 1.4 → 1.0 (200ms spring)
 *   2. Fire emoji pulses with orange glow
 *   3. Bottom sheet appears: "🔥 14-day streak! You and Priya are regulars."
 *   4. Haptic: heavy impact
 *
 * Send Interest Press:
 *   1. Button scale: 1.0 → 0.96 (100ms) → 1.0 (100ms)
 *   2. After confirmation: button text changes to "Interest Sent ✓"
 *   3. Haptic: selection (light)
 *
 * Input Focus:
 *   1. Border color transitions from neutral to blue (200ms)
 *   2. Background tints to blue50 (200ms)
 *   3. Label shifts up and shrinks (if floating label pattern) — 150ms ease-out
 *
 * Bottom Sheet Open:
 *   1. Scrim fades in (200ms)
 *   2. Sheet translates from bottom (300ms, ease-out decelerate)
 *   3. Handle fades in (100ms delay)
 *
 * Tab Switch (bottom nav):
 *   1. Icon: weight changes Regular → Fill (instant)
 *   2. Color: neutral → orange (150ms)
 *   3. Label: color change matches icon (150ms)
 *   4. No scale — scaling nav icons looks cheap
 */
const microInteractions = {
  // Reference only — see notes above for implementation
  matchFoundCelebration: 'confetti-burst-spring-card-banner',
  acceptanceAnimation:   'border-flash-icon-swap-chip-transition',
  ratingSubmission:      'star-sequence-tag-bounce-toast',
  streakMilestone:       'badge-pulse-bottom-sheet',
  sendInterestPress:     'button-scale-state-change',
  inputFocus:            'border-color-bg-tint',
  bottomSheetOpen:       'scrim-fade-sheet-translate',
  tabSwitch:             'icon-weight-color-transition',
};


// ─────────────────────────────────────────────────────────────────────────────
// COPY GUIDELINES (Tone of Voice Tokens)
// Used by engineers when writing fallback/error messages in code.
// ─────────────────────────────────────────────────────────────────────────────

const copy = {
  // Empty states — always include a primary action
  emptyHome:       "No RouteMatches yet",
  emptyHomeBody:   "More students are joining your route.",
  emptyMessages:   "Match with someone to start chatting",
  emptyRides:      "No active rides yet",
  emptyRidesBody:  "Send a ride interest to someone on your route and you'll appear here.",
  emptyNotifs:     "You're all caught up",
  emptyNotifBody:  "We'll let you know when there's a new match or message.",
  emptyExplore:    "Be the first on your route",

  // Error states — direct, not apologetic, explain and offer fix
  errorNetwork:    "No internet connection",
  errorNetworkBody:"Your matches are saved. Connect to see new ones.",
  errorServer:     "Something went wrong on our end",
  errorServerCTA:  "Try again",
  errorDomain:     "That email isn't supported yet",
  errorDomainCTA:  "Request JNTU access →",
  error404:        "This page doesn't exist",
  error404CTA:     "Go back home",
  errorGhosted:    "This account no longer exists",
  errorGhostedBody:"Looks like this ride match deleted their account.",

  // Success states — warm, not corporate
  successProfile:  "You're all set 🎉",
  successInterest: "Interest sent! We'll notify you when they respond.",
  successMatch:    "You're connected! Start chatting with your new ride match.",
  successRating:   "Rating sent. Thanks for keeping the community trustworthy.",
  successEmail:    "Check your inbox",
  successEmailBody:"We sent a link to ",  // append email address

  // Action labels — sentence case, clear verbs
  sendInterest:    "Send Ride Interest",
  acceptRequest:   "Accept",
  declineRequest:  "Decline",
  openChat:        "Open Chat",
  viewProfile:     "View Profile",
  reviewRoute:     "Review my route",
  getStarted:      "Get Started",
  nextStep:        "Next →",
  completeProfile: "Complete Profile →",
  skipForNow:      "I'll add this later",
  sendLink:        "Send Verification Link",
  tryAgain:        "Try again",
  requestCollege:  "Request JNTU access →",
  applyFilters:    "Apply Filters",
  resetFilters:    "Reset",
  submitRating:    "Submit Rating",
  skipRating:      "Skip for now",

  // Safety
  safetyBanner:    "Never share OTPs or passwords in chat. Meet at a public spot first.",

  // Limits & constraints
  interestLimit:   "You can send 5 ride interests per day.",
  messageLimit:    "Messages limited to matched ride partners only.",

  // Footer
  madeIn:          "Made for JNTU",
};


// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  palette,           // raw primitives — only for extending the system
  colors,            // semantic light mode colors
  darkColors,        // semantic dark mode overrides
  typography,        // all text styles
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
  spacing,
  layout,
  borderRadius,
  shadows,
  zIndex,
  animation,
  components,        // pre-composed component token sets
  gradients,
  icons,             // Phosphor icon name registry
  iconSizes,
  microInteractions, // spec notes for motion design
  copy,              // UI string tokens
};

export default theme;


// ─────────────────────────────────────────────────────────────────
// END OF FILE — theme.js RouteMatch Design System v1.0
// Made for JNTU
// ─────────────────────────────────────────────────────────────────
