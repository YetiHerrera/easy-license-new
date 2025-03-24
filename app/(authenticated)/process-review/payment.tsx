import { View, StyleSheet, useColorScheme, Pressable, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import FormInput from '@/components/auth/FormInput';

type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export default function Payment() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
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

  // Get card icon based on type
  const getCardIcon = () => {
    const cardType = getCardType();
    
    switch (cardType) {
      case 'visa':
        return <FontAwesome name="cc-visa" size={24} color={theme.secondary} />;
      case 'mastercard':
        return <FontAwesome name="cc-mastercard" size={24} color={theme.secondary} />;
      case 'amex':
        return <FontAwesome name="cc-amex" size={24} color={theme.secondary} />;
      case 'discover':
        return <FontAwesome name="cc-discover" size={24} color={theme.secondary} />;
      default:
        return <FontAwesome name="credit-card" size={24} color={theme.text} />;
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
  const handleSubmit = () => {
    if (validateForm()) {
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        
        // Show success alert and navigate to success screen or home
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
      }, 2000);
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
            <View style={[styles.cardPreview, { backgroundColor: theme.primary }]}>
              <View style={styles.cardHeader}>
                <FontAwesome name="credit-card-alt" size={24} color="#fff" />
                {getCardIcon()}
              </View>
              <View style={styles.cardNumberContainer}>
                <Text style={styles.cardNumberText}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </Text>
              </View>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>{t('payment.cardholderName')}</Text>
                  <Text style={styles.cardValue}>
                    {cardholderName || t('payment.cardholderNamePlaceholder')}
                  </Text>
                </View>
                <View>
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
                    {getCardIcon()}
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
              
              {/* Payment Security Note */}
              <View style={styles.securityNote}>
                <Ionicons name="lock-closed" size={16} color={theme.success} />
                <Text style={[styles.securityText, { color: theme.text }]}>
                  {t('payment.securityNote')}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.payButton, 
              { 
                backgroundColor: isFormValid() && !isProcessing ? theme.primary : theme.formInputBackgroundDisabled,
                opacity: isFormValid() && !isProcessing ? 1 : 0.5,
              }
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid() || isProcessing}
          >
            {isProcessing ? (
              <Text style={styles.payButtonText}>
                {t('payment.processing')}
              </Text>
            ) : (
              <Text style={styles.payButtonText}>
                {t('payment.payNow')}
              </Text>
            )}
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cardNumberContainer: {
    marginBottom: 30,
  },
  cardNumberText: {
    color: '#fff',
    fontSize: 22,
    letterSpacing: 2,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  cardValue: {
    color: '#fff',
    fontSize: 16,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 17,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  payButton: {
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 