import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme, FlatList, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { FontAwesome5, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { CompletedProcess } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const { signOut } = useAuth();
  const { hasActiveProcesses, completedProcesses, userProfile } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const handleStartNewProcess = () => {
    router.push('/(authenticated)/process-review/license-information');
  };

  const handleLogout = async () => {
    await signOut();
    // The router navigation will be handled by AuthContext's state change
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: 'pending' | 'processing' | 'completed') => {
    switch (status) {
      case 'pending':
        return '#FF9500'; // Orange for pending
      case 'processing':
        return '#007AFF'; // Blue for processing
      case 'completed':
        return '#34C759'; // Green for completed
      default:
        return theme.text;
    }
  };

  const getStatusText = (status: 'pending' | 'processing' | 'completed') => {
    switch (status) {
      case 'pending':
        return t('process.statusPending');
      case 'processing':
        return t('process.statusProcessing');
      case 'completed':
        return t('process.statusCompleted');
      default:
        return '';
    }
  };

  const getStatusIcon = (status: 'pending' | 'processing' | 'completed') => {
    switch (status) {
      case 'pending':
        return <AntDesign name="clockcircleo" size={16} color="#FFFFFF" />;
      case 'processing':
        return <AntDesign name="sync" size={16} color="#FFFFFF" />;
      case 'completed':
        return <AntDesign name="checkcircleo" size={16} color="#FFFFFF" />;
      default:
        return null;
    }
  };

  // Get user's full name or email username
  const getUserName = () => {
    if (completedProcesses && completedProcesses.length > 0) {
      const process = completedProcesses[0];
      if (process.licenseInformation && process.licenseInformation.names) {
        return `${process.licenseInformation.names} ${process.licenseInformation.lastNames}`;
      }
    }
    
    if (userProfile && userProfile.email) {
      return userProfile.email.split('@')[0];
    }
    
    return t('home.welcome');
  };

  const WelcomeHeader = () => (
    <View style={styles.welcomeHeaderContainer}>
      <View style={styles.welcomeTextContainer}>
        <Text style={[styles.welcomeBackText, { color: theme.text, fontWeight: 'bold' }]}>
          {t('home.welcomeBack')}
        </Text>
        <Text style={[styles.userName, { color: theme.text }]}>
          {getUserName()}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.formInputBackground }]} 
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <WelcomeHeader />
      
      <View style={styles.content}>
        <Image 
          source={require('@/assets/images/image_licence_blank.png')}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.text }]}>
          {t('home.emptyState.title')}
        </Text>
        <Text style={[styles.description, { color: theme.text }]}>
          {t('home.emptyState.description')}
        </Text>
        <TouchableOpacity 
          style={[styles.exploreButton, { backgroundColor: theme.primary }]}
          onPress={handleStartNewProcess}
        >
          <Text style={styles.buttonText}>{t('home.emptyState.startButton')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderProcessItem = ({ item: process }: { item: CompletedProcess }) => {
    // Determine primary color for card based on process type
    const primaryColor = process.processTypes.includes('renewal') 
      ? theme.primary 
      : process.processTypes.includes('replacement') 
        ? theme.secondary 
        : theme.primary;
    
    // Create gradient colors
    const gradientStart = `${primaryColor}CC`; // 80% opacity
    const gradientEnd = `${primaryColor}`;
    
    // Get status color
    const statusColor = getStatusColor(process.status);
    
    // Determine process type text
    const getProcessTypeDisplay = () => {
      const hasRenewal = process.processTypes.includes('renewal');
      const hasReplacement = process.processTypes.includes('replacement');
      
      if (hasRenewal && hasReplacement) {
        return (
          <View style={styles.typeChip}>
            <AntDesign name="swap" size={14} color="#FFFFFF" style={styles.typeIcon} />
            <Text style={styles.typeChipText}>
              {t('processResume.renewalAndReplacement')}
            </Text>
          </View>
        );
      } else if (hasRenewal) {
        return (
          <View style={styles.typeChip}>
            <FontAwesome5 name="sync" size={14} color="#FFFFFF" style={styles.typeIcon} />
            <Text style={styles.typeChipText}>
              {t('processType.renewal')}
            </Text>
          </View>
        );
      } else if (hasReplacement) {
        return (
          <View style={styles.typeChip}>
            <MaterialCommunityIcons name="folder-cog" size={14} color="#FFFFFF" style={styles.typeIcon} />
            <Text style={styles.typeChipText}>
              {t('processType.replacement')}
            </Text>
          </View>
        );
      }
      return null;
    };
    
    return (
      <View style={[styles.processCardContainer, { shadowColor: theme.text }]}>
        <LinearGradient
          colors={[gradientStart, gradientEnd]}
          style={styles.processCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Status Header */}
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              {getStatusIcon(process.status)}
              <Text style={styles.statusText}>
                {getStatusText(process.status)}
              </Text>
            </View>
          </View>
          
          {/* License Info */}
          <View style={styles.licenseInfoContainer}>
            <View style={styles.licenseInfoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('licenseInformation.dpi')}</Text>
                <Text style={styles.infoValue}>{process.licenseInformation.dpi}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('process.licenseType')}</Text>
                <Text style={styles.infoValue}>{process.licenseInformation.licenseType}</Text>
              </View>
            </View>
            
            <View style={styles.licenseInfoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('process.paymentDate')}</Text>
                <Text style={styles.infoValue}>{formatDate(process.paymentDate)}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('licenseInformation.renewalYears')}</Text>
                <Text style={styles.infoValue}>
                  {process.licenseInformation.renewalYears !== 'unselected' 
                    ? `${process.licenseInformation.renewalYears} ${t('licenseInformation.years')}` 
                    : '-'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Card Footer */}
          <View style={styles.cardFooter}>
            {getProcessTypeDisplay()}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderProcessList = () => (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <WelcomeHeader />
      
      <FlatList
        data={completedProcesses}
        renderItem={renderProcessItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );

  return hasActiveProcesses() ? renderProcessList() : renderEmptyState();
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  welcomeHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeTextContainer: {
    flexDirection: 'column',
  },
  welcomeBackText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  exploreButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  processCardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  processCard: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  statusHeader: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  typeIcon: {
    marginRight: 6,
  },
  typeChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  licenseInfoContainer: {
    gap: 16,
    marginBottom: 20,
  },
  licenseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'column',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 