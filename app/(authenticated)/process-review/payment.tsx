import { View, StyleSheet, useColorScheme, Pressable, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import FormInput from '@/components/auth/FormInput';
import { useData } from '@/contexts/DataContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

// Calculate total charges in Quetzales
const calculateTotal = (processTypes: string[]) => {
  const CHARGES = {
    renewal: 100,
    replacement: 100,
    visualTest: 50,
    expiredLicense: 50,
    delivery: 120,
  };

  let total = 0;

  // Add process type charges
  if (processTypes.includes('renewal')) {
    total += CHARGES.renewal;
  }
  if (processTypes.includes('replacement')) {
    total += CHARGES.replacement;
  }

  // Add other charges
  total += CHARGES.visualTest;
  total += CHARGES.expiredLicense;
  total += CHARGES.delivery;

  return total;
};

type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export default function Payment() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  const { processData, addCompletedProcess } = useData();

  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Format card number with spaces as user types
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted;
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    }
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
  };

  // Determine card type based on number
  const getCardType = (): CardType => {
    const number = cardNumber.replace(/\s+/g, '');

    // Visa
    if (/^4/.test(number)) {
      return 'visa';
    }

    // Mastercard
    if (/^5[1-5]/.test(number)) {
      return 'mastercard';
    }

    // Amex
    if (/^3[47]/.test(number)) {
      return 'amex';
    }

    // Discover
    if (/^(6011|65|64[4-9])/.test(number)) {
      return 'discover';
    }

    return 'unknown';
  };

  // Get card icon based on type with specific styles for each card type
  const getCardIcon = (isDeactivated = false, forCardDisplay = false) => {
    const cardType = getCardType();

    // For card display, always use white color
    const iconColor = forCardDisplay ? "#FFFFFF" : undefined;

    // If deactivated style is requested or card type is unknown, show deactivated style
    if (isDeactivated || cardType === 'unknown') {
      return <FontAwesome name="credit-card" size={24} color={iconColor || "#BBBBBB"} style={{ opacity: 0.6 }} />;
    }

    // Specific styles for different card types
    switch (cardType) {
      case 'visa':
        return <FontAwesome name="cc-visa" size={24} color={iconColor || "#1A1F71"} />; // Visa blue
      case 'mastercard':
        return <FontAwesome name="cc-mastercard" size={24} color={iconColor || "#EB001B"} />; // Mastercard red
      case 'amex':
        return <FontAwesome name="cc-amex" size={24} color={iconColor || "#2E77BC"} />; // Amex blue
      case 'discover':
        return <FontAwesome name="cc-discover" size={24} color={iconColor || "#FF6600"} />; // Discover orange
      default:
        // Default style for other card types
        return <FontAwesome name="credit-card" size={24} color={iconColor || theme.secondary} />;
    }
  };

  // Get gradient colors based on card type
  const getCardGradientColors = (): readonly [string, string] => {
    const cardType = getCardType();
    const hasData = cardNumber.length > 0;

    // If no data, return gray gradient
    if (!hasData) {
      return ['#888888', '#555555'] as const;
    }

    // Return specific colors for different card types
    switch (cardType) {
      case 'visa':
        return ['#1A1F71', '#4B5ED7'] as const; // Visa blue gradient
      case 'mastercard':
        return ['#EB001B', '#F79E1B'] as const; // Mastercard red to yellow gradient
      case 'amex':
        return ['#2E77BC', '#108168'] as const; // Amex blue to green gradient
      case 'discover':
        return ['#FF6600', '#FBAA19'] as const; // Discover orange gradient
      default:
        return [theme.primary, theme.secondary] as const; // Default theme gradient
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate card number (13-19 digits)
    const cardNumberWithoutSpaces = cardNumber.replace(/\s+/g, '');
    if (!cardNumberWithoutSpaces) {
      newErrors.cardNumber = t('payment.cardNumberRequired');
    } else if (!/^\d{13,19}$/.test(cardNumberWithoutSpaces)) {
      newErrors.cardNumber = t('payment.invalidCardNumber');
    }

    // Validate expiry date (MM/YY format)
    if (!expiryDate) {
      newErrors.expiryDate = t('payment.expiryDateRequired');
    } else {
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
      const currentMonth = currentDate.getMonth() + 1; // Convert to 1-12

      if (!/^\d{2}\/\d{2}$/.test(expiryDate) || parseInt(month) > 12 || parseInt(month) < 1) {
        newErrors.expiryDate = t('payment.invalidExpiryDate');
      } else if (
        (parseInt(year) < currentYear) || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = t('payment.expiredCard');
      }
    }

    // Validate CVV (3-4 digits)
    if (!cvv) {
      newErrors.cvv = t('payment.cvvRequired');
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = t('payment.invalidCvv');
    }

    // Validate cardholder name
    if (!cardholderName.trim()) {
      newErrors.cardholderName = t('payment.cardholderNameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsProcessing(true);

      try {
        // Calculate total amount
        const totalAmount = calculateTotal(processData.processTypes);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Add the completed process to the data context
        await addCompletedProcess(totalAmount);

        // Show success alert and navigate to home
        Alert.alert(
          t('payment.paymentSuccessTitle'),
          t('payment.paymentSuccessMessage'),
          [
            {
              text: t('payment.ok'),
              onPress: () => router.replace('/(authenticated)/home' as any),
            },
          ]
        );
      } catch (error) {
        console.error('Error processing payment:', error);
        Alert.alert(
          t('payment.paymentFailedTitle'),
          t('payment.paymentFailedMessage'),
          [{ text: t('payment.ok') }]
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle changes in card number with formatting
  const handleCardNumberChange = (text: string) => {
    if (text.length <= 19) { // Limit to 16 digits + 3 spaces
      setCardNumber(formatCardNumber(text));

      // Clear error if it exists
      if (errors.cardNumber) {
        setErrors({...errors, cardNumber: ''});
      }
    }
  };

  // Handle changes in expiry date with formatting
  const handleExpiryDateChange = (text: string) => {
    if (text.length <= 5) { // MM/YY format (5 chars)
      setExpiryDate(formatExpiryDate(text));

      // Clear error if it exists
      if (errors.expiryDate) {
        setErrors({...errors, expiryDate: ''});
      }
    }
  };

  // Check if form is valid for enabling the pay button
  const isFormValid = () => {
    return (
      cardNumber.replace(/\s+/g, '').length >= 13 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      cardholderName.trim().length > 0 &&
      !errors.cardNumber &&
      !errors.expiryDate &&
      !errors.cvv &&
      !errors.cardholderName
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('payment.title'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text variant="title" style={[styles.title, { color: theme.primaryTitles }]}>
              {t('payment.title')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              {t('payment.subtitle')}
            </Text>

            {/* Credit Card UI */}
            <View style={styles.cardPreview}>
              <LinearGradient
                colors={getCardGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              />

              {/* Card Background Pattern */}
              <View style={styles.cardPattern}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.cardPatternCircle,
                      {
                        opacity: 0.07 + (index * 0.01),
                        transform: [{ scale: 1 + (index * 0.2) }]
                      }
                    ]}
                  />
                ))}
              </View>

              <View style={styles.cardHeader}>
                {getCardIcon(cardNumber.length === 0, true)}
              </View>

              {/* Card Chip */}
              <View style={styles.cardChip}>
                <View style={styles.cardChipLines} />
                <View style={styles.cardChipLines} />
                <View style={styles.cardChipLines} />
              </View>

              <View style={styles.cardNumberContainer}>
                <Text style={styles.cardNumberText}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.cardholderSection}>
                  <Text style={styles.cardLabel}>{t('payment.cardholderName')}</Text>
                  <Text style={styles.cardValue}>
                    {cardholderName || t('payment.cardholderNamePlaceholder')}
                  </Text>
                </View>
                <View style={styles.expirySection}>
                  <Text style={styles.cardLabel}>{t('payment.expiryDate')}</Text>
                  <Text style={styles.cardValue}>
                    {expiryDate || 'MM/YY'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {t('payment.cardNumber')}
                </Text>
                <View style={styles.inputWithIcon}>
                  <FormInput
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    placeholder={t('payment.cardNumberPlaceholder')}
                    keyboardType="numeric"
                    error={errors.cardNumber}
                  />
                  <View style={styles.inputIcon}>
                    {getCardIcon(cardNumber.length === 0)}
                  </View>
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    {t('payment.expiryDate')}
                  </Text>
                  <FormInput
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    error={errors.expiryDate}
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    {t('payment.cvv')}
                  </Text>
                  <FormInput
                    value={cvv}
                    onChangeText={(text) => {
                      setCvv(text.replace(/[^\d]/g, ''));
                      if (errors.cvv) setErrors({...errors, cvv: ''});
                    }}
                    placeholder="123"
                    keyboardType="numeric"
                    error={errors.cvv}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {t('payment.cardholderName')}
                </Text>
                <FormInput
                  value={cardholderName}
                  onChangeText={(text) => {
                    setCardholderName(text);
                    if (errors.cardholderName) setErrors({...errors, cardholderName: ''});
                  }}
                  placeholder={t('payment.cardholderNamePlaceholder')}
                  error={errors.cardholderName}
                />
              </View>

            </View>
          </View>
        </ScrollView>


        {/* Payment Security Note */}
        <View style={[styles.securityNote, { backgroundColor: `${theme.success}15` }]}>
          <Ionicons name="shield-checkmark" size={18} color={theme.success} />
          <Text style={[styles.securityText, { color: theme.text }]}>
            {t('payment.securityNote')}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.payButton, 
              { 
                opacity: isFormValid() && !isProcessing ? 1 : 0.5,
              }
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid() || isProcessing}
          >
            <View
              style={[
                styles.payButtonGradient,
                {
                  backgroundColor: isFormValid() && !isProcessing
                    ? theme.primary
                    : theme.formInputBackgroundDisabled
                }
              ]}
            />

            <View style={styles.payButtonContent}>
              {isProcessing ? (
                <>
                  <ActivityIndicator size="small" color="#fff" style={styles.payButtonSpinner} />
                  <Text style={styles.payButtonText}>
                    {t('payment.processing')}
                  </Text>
                </>
              ) : (
                <>
                  <FontAwesome name="credit-card" size={16} color="#fff" />
                  <Text style={styles.payButtonText}>
                    {t('payment.payNow')}
                  </Text>
                </>
              )}
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  cardPreview: {
    height: 200,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  cardChip: {
    width: 40,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#E6C06A',
    marginBottom: 5,
    justifyContent: 'center',
  },
  cardChipLines: {
    height: 4,
    backgroundColor: '#D4AF37',
    marginVertical: 2,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  cardPattern: {
    position: 'absolute',
    top: -50,
    right: -50,
    opacity: 0.6,
  },
  cardPatternCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    zIndex: 1,
  },
  cardNumberContainer: {
    marginBottom: 15,
    zIndex: 1,
  },
  cardNumberText: {
    color: '#fff',
    fontSize: 22,
    letterSpacing: 3,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  cardholderSection: {
    flex: 2,
    marginRight: 10,
    overflow: 'hidden',
  },
  expirySection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  cardValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(2, 134, 74, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  securityText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  payButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  payButtonGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  payButtonSpinner: {
    marginRight: 10,
  },
}); 
