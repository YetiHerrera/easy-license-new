import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { Stack, router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  withSpring,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withTiming
} from 'react-native-reanimated';
import { t, changeLanguage, loadSavedLanguage } from '../../constants/i18n';
import { SvgXml } from 'react-native-svg';

const UsFlagSvg = `<svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_270_67495)">
<rect width="32" height="24" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H32V24H0V0Z" fill="#F7FCFF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 14.6667V16.6667H32V14.6667H0Z" fill="#E31D1C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 18.3333V20.3333H32V18.3333H0Z" fill="#E31D1C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 7.33331V9.33331H32V7.33331H0Z" fill="#E31D1C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 22V24H32V22H0Z" fill="#E31D1C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 11V13H32V11H0Z" fill="#E31D1C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 0V2H32V0H0Z" fill="#E31D1C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 3.66669V5.66669H32V3.66669H0Z" fill="#E31D1C"/>
<rect width="20" height="13" fill="#2E42A5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.72203 2.93864L0.996148 3.44753L1.24121 2.54192L0.596497 1.96801H1.43858L1.72101 1.22894L2.05218 1.96801H2.77004L2.206 2.54192L2.42437 3.44753L1.72203 2.93864ZM5.72203 2.93864L4.99615 3.44753L5.24121 2.54192L4.5965 1.96801H5.43858L5.72101 1.22894L6.05218 1.96801H6.77004L6.206 2.54192L6.42437 3.44753L5.72203 2.93864ZM8.99615 3.44753L9.72203 2.93864L10.4244 3.44753L10.206 2.54192L10.77 1.96801H10.0522L9.72101 1.22894L9.43858 1.96801H8.5965L9.24121 2.54192L8.99615 3.44753ZM13.722 2.93864L12.9961 3.44753L13.2412 2.54192L12.5965 1.96801H13.4386L13.721 1.22894L14.0522 1.96801H14.77L14.206 2.54192L14.4244 3.44753L13.722 2.93864ZM0.996148 7.44753L1.72203 6.93864L2.42437 7.44753L2.206 6.54192L2.77004 5.96801H2.05218L1.72101 5.22894L1.43858 5.96801H0.596497L1.24121 6.54192L0.996148 7.44753ZM5.72203 6.93864L4.99615 7.44753L5.24121 6.54192L4.5965 5.96801H5.43858L5.72101 5.22894L6.05218 5.96801H6.77004L6.206 6.54192L6.42437 7.44753L5.72203 6.93864ZM8.99615 7.44753L9.72203 6.93864L10.4244 7.44753L10.206 6.54192L10.77 5.96801H10.0522L9.72101 5.22894L9.43858 5.96801H8.5965L9.24121 6.54192L8.99615 7.44753ZM13.722 6.93864L12.9961 7.44753L13.2412 6.54192L12.5965 5.96801H13.4386L13.721 5.22894L14.0522 5.96801H14.77L14.206 6.54192L14.4244 7.44753L13.722 6.93864ZM0.996148 11.4475L1.72203 10.9386L2.42437 11.4475L2.206 10.5419L2.77004 9.96801H2.05218L1.72101 9.22894L1.43858 9.96801H0.596497L1.24121 10.5419L0.996148 11.4475ZM5.72203 10.9386L4.99615 11.4475L5.24121 10.5419L4.5965 9.96801H5.43858L5.72101 9.22894L6.05218 9.96801H6.77004L6.206 10.5419L6.42437 11.4475L5.72203 10.9386ZM8.99615 11.4475L9.72203 10.9386L10.4244 11.4475L10.206 10.5419L10.77 9.96801H10.0522L9.72101 9.22894L9.43858 9.96801H8.5965L9.24121 10.5419L8.99615 11.4475ZM13.722 10.9386L12.9961 11.4475L13.2412 10.5419L12.5965 9.96801H13.4386L13.721 9.22894L14.0522 9.96801H14.77L14.206 10.5419L14.4244 11.4475L13.722 10.9386ZM16.9961 3.44753L17.722 2.93864L18.4244 3.44753L18.206 2.54192L18.77 1.96801H18.0522L17.721 1.22894L17.4386 1.96801H16.5965L17.2412 2.54192L16.9961 3.44753ZM17.722 6.93864L16.9961 7.44753L17.2412 6.54192L16.5965 5.96801H17.4386L17.721 5.22894L18.0522 5.96801H18.77L18.206 6.54192L18.4244 7.44753L17.722 6.93864ZM16.9961 11.4475L17.722 10.9386L18.4244 11.4475L18.206 10.5419L18.77 9.96801H18.0522L17.721 9.22894L17.4386 9.96801H16.5965L17.2412 10.5419L16.9961 11.4475ZM3.72203 4.93864L2.99615 5.44753L3.24121 4.54192L2.5965 3.96801H3.43858L3.72101 3.22894L4.05218 3.96801H4.77004L4.206 4.54192L4.42437 5.44753L3.72203 4.93864ZM6.99615 5.44753L7.72203 4.93864L8.42437 5.44753L8.206 4.54192L8.77004 3.96801H8.05218L7.72101 3.22894L7.43858 3.96801H6.5965L7.24121 4.54192L6.99615 5.44753ZM11.722 4.93864L10.9961 5.44753L11.2412 4.54192L10.5965 3.96801H11.4386L11.721 3.22894L12.0522 3.96801H12.77L12.206 4.54192L12.4244 5.44753L11.722 4.93864ZM2.99615 9.44753L3.72203 8.93864L4.42437 9.44753L4.206 8.54192L4.77004 7.96801H4.05218L3.72101 7.22894L3.43858 7.96801H2.5965L3.24121 8.54192L2.99615 9.44753ZM7.72203 8.93864L6.99615 9.44753L7.24121 8.54192L6.5965 7.96801H7.43858L7.72101 7.22894L8.05218 7.96801H8.77004L8.206 8.54192L8.42437 9.44753L7.72203 8.93864ZM10.9961 9.44753L11.722 8.93864L12.4244 9.44753L12.206 8.54192L12.77 7.96801H12.0522L11.721 7.22894L11.4386 7.96801H10.5965L11.2412 8.54192L10.9961 9.44753ZM15.722 4.93864L14.9961 5.44753L15.2412 4.54192L14.5965 3.96801H15.4386L15.721 3.22894L16.0522 3.96801H16.77L16.206 4.54192L16.4244 5.44753L15.722 4.93864ZM14.9961 9.44753L15.722 8.93864L16.4244 9.44753L16.206 8.54192L16.77 7.96801H16.0522L15.721 7.22894L15.4386 7.96801H14.5965L15.2412 8.54192L14.9961 9.44753Z" fill="#F7FCFF"/>
</g>
<defs>
<clipPath id="clip0_270_67495">
<rect width="32" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
`
const GtFlagSvg = `<svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_270_67392)">
<rect width="32" height="24" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M22 0H32V24H22V0Z" fill="#58A5FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H12V24H0V0Z" fill="#58A5FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10 0H22V24H10V0Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.7684 15.7184L12.2902 16.4015L14.6595 13.1896V12.621L11.7684 15.7184Z" fill="#6C301F"/>
<path d="M13.4043 12.1356L13.5775 11.897C15.8213 13.5841 17.411 14.8793 18.2998 15.9585L17.7448 16.4156C16.9 15.3899 15.6064 13.7914 13.4043 12.1356Z" fill="#979797"/>
<path d="M17.0211 10.7256L16.7629 10.4753L18.1777 9.01612L18.4876 9.31725L19.9564 7.94955L20.2014 8.21267L18.4824 9.8134L18.1853 9.52477L17.0211 10.7256Z" fill="#979797"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.5058 8.44538C12.4303 8.11707 12.3451 7.71159 12.3451 7.71159C12.1557 8.14374 12.096 8.53691 12.1721 8.88848C12.0916 8.99929 12.0186 9.10308 11.9533 9.19991C11.7496 8.93081 11.4954 8.42752 11.4954 8.42752C11.5043 8.57406 11.5002 8.72357 11.4963 8.86874C11.4872 9.20986 11.4787 9.52706 11.6388 9.72571L11.6369 9.72967C11.6049 9.79548 11.5747 9.86117 11.5461 9.92672C11.3253 9.70659 10.9589 9.30968 10.9589 9.30968C10.9876 9.78565 11.1193 10.1607 11.3587 10.4284C11.3154 10.5679 11.2796 10.7066 11.2513 10.8445C11.0662 10.653 10.8876 10.4638 10.8876 10.4638C10.9138 10.8982 10.9865 11.1851 11.1752 11.4262C11.1714 11.4948 11.1695 11.5631 11.1694 11.6311C10.9738 11.4294 10.7749 11.2186 10.7749 11.2186C10.8025 11.677 10.9812 11.9786 11.2166 12.2297C11.24 12.3748 11.2719 12.5184 11.3122 12.6602L11.3337 12.7351C11.0675 12.6065 10.7766 12.4604 10.7766 12.4604C10.9503 12.8609 11.2039 13.0815 11.4923 13.2359C11.554 13.4153 11.619 13.5888 11.6872 13.7558C11.375 13.6709 10.9087 13.5314 10.9087 13.5314C11.1853 13.95 11.5245 14.1164 11.8889 14.2121C11.9634 14.3677 12.0407 14.5163 12.1207 14.6575C11.8248 14.5745 11.4776 14.4706 11.4776 14.4706C11.7461 14.8772 12.0738 15.0458 12.4264 15.1428C12.6589 15.4734 12.9079 15.745 13.1677 15.9484C12.8814 16.0784 12.5209 16.2339 12.5209 16.2339C12.928 16.3549 13.2533 16.3086 13.5502 16.1939C13.5619 16.1998 13.5735 16.2055 13.5852 16.2111C13.7133 16.2725 13.8568 16.3304 14.0187 16.3868C13.7839 16.4913 13.5603 16.5878 13.5603 16.5878C13.958 16.706 14.2776 16.6645 14.569 16.5556L14.6006 16.5642C14.7435 16.6032 14.8889 16.6405 15.0806 16.6879C14.9538 16.6565 15.4217 16.7719 15.5167 16.7961C15.8209 16.8735 15.9941 16.9278 16.0772 16.9747C16.085 16.9791 16.0907 16.9827 16.0942 16.9849L16.0943 16.985C16.0979 16.9873 16.0994 16.9882 16.0986 16.9871L16.3313 16.8181C16.3043 16.7809 16.2668 16.7514 16.2184 16.7241C16.1043 16.6598 15.9191 16.6017 15.5876 16.5174C15.4933 16.4934 15.0401 16.3816 15.1428 16.407C14.9565 16.3609 14.8148 16.3245 14.6762 16.2867C14.6348 16.2755 14.5944 16.2642 14.555 16.253C14.5881 15.9472 14.5495 15.6303 14.341 15.2771C14.341 15.2771 14.2503 15.8287 14.1887 16.1409C14.0048 16.0794 13.8463 16.0173 13.7094 15.9517C13.6632 15.9295 13.6171 15.9048 13.5711 15.8776C13.5527 15.5656 13.4611 15.2552 13.19 14.9385C13.19 14.9385 13.1941 15.2891 13.1925 15.593C13.0035 15.4204 12.8199 15.2058 12.645 14.9538L12.7675 15.0187C12.781 14.6296 12.7211 14.2461 12.3844 13.8527C12.3844 13.8527 12.3888 14.232 12.3867 14.5435C12.2774 14.3526 12.1727 14.1464 12.0734 13.9262C12.1656 13.6237 12.1878 13.2977 12.0397 12.9027C12.0397 12.9027 11.9517 13.1535 11.8594 13.4065C11.8323 13.3346 11.8058 13.2615 11.7799 13.1873C11.9685 12.8707 12.0895 12.5202 11.9996 12.0376C11.9996 12.0376 11.7852 12.419 11.6218 12.6954C11.6107 12.6578 11.5997 12.6198 11.5889 12.5817C11.5545 12.4606 11.5267 12.3381 11.5056 12.2144C11.7744 11.9867 11.9916 11.703 12.0687 11.2396C12.0687 11.2396 11.7093 11.5483 11.4589 11.753C11.4554 11.6501 11.4566 11.5464 11.4624 11.4419C11.7517 11.2662 12.0009 11.0264 12.1513 10.6005C12.1513 10.6005 11.7969 10.8106 11.5202 10.9671C11.5399 10.8624 11.5642 10.7571 11.5931 10.6512L11.5935 10.6614C11.9372 10.4785 12.2394 10.2348 12.4117 9.74659C12.4117 9.74659 12.0556 9.9577 11.7787 10.1144C11.8146 10.0284 11.8535 9.942 11.8956 9.85533C11.9457 9.75228 12.0167 9.62931 12.1087 9.48663C12.4155 9.38942 12.7012 9.22089 12.9441 8.86669C12.9441 8.86669 12.6987 8.93548 12.4443 9.00359C12.5918 8.80263 12.7649 8.57779 12.9633 8.32936L12.7386 8.14985C12.6568 8.25223 12.5792 8.35073 12.5058 8.44538Z" fill="#5AB92D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.6337 8.44538C19.7092 8.11707 19.7944 7.71159 19.7944 7.71159C19.9838 8.14374 20.0435 8.53691 19.9674 8.88848C20.048 8.99929 20.1209 9.10308 20.1862 9.19991C20.3899 8.93081 20.6441 8.42752 20.6441 8.42752C20.6353 8.57406 20.6393 8.72357 20.6432 8.86874C20.6523 9.20986 20.6609 9.52706 20.5007 9.72571L20.5026 9.72967C20.5346 9.79548 20.5649 9.86117 20.5935 9.92672C20.8142 9.70659 21.1806 9.30968 21.1806 9.30968C21.1519 9.78565 21.0202 10.1607 20.7808 10.4284C20.8242 10.5679 20.8599 10.7066 20.8882 10.8445C21.0734 10.653 21.2519 10.4638 21.2519 10.4638C21.2257 10.8982 21.1531 11.1851 20.9643 11.4262C20.9681 11.4948 20.9701 11.5631 20.9702 11.6311C21.1658 11.4294 21.3646 11.2186 21.3646 11.2186C21.337 11.677 21.1583 11.9786 20.9229 12.2297C20.8995 12.3748 20.8676 12.5184 20.8274 12.6602L20.8058 12.7351C21.072 12.6065 21.3629 12.4604 21.3629 12.4604C21.1892 12.8609 20.9357 13.0815 20.6472 13.2359C20.5856 13.4153 20.5205 13.5888 20.4523 13.7558C20.7645 13.6709 21.2308 13.5314 21.2308 13.5314C20.9543 13.95 20.6151 14.1164 20.2506 14.2121C20.1761 14.3677 20.0988 14.5163 20.0189 14.6575C20.3147 14.5745 20.662 14.4706 20.662 14.4706C20.3934 14.8772 20.0657 15.0458 19.7132 15.1428C19.4806 15.4734 19.2316 15.745 18.9719 15.9484C19.2581 16.0784 19.6186 16.2339 19.6186 16.2339C19.2115 16.3549 18.8862 16.3086 18.5893 16.1939C18.5777 16.1998 18.566 16.2055 18.5543 16.2111C18.4262 16.2725 18.2827 16.3304 18.1208 16.3868C18.3556 16.4913 18.5792 16.5878 18.5792 16.5878C18.1815 16.706 17.8619 16.6645 17.5706 16.5556L17.539 16.5642C17.396 16.6032 17.2506 16.6405 17.059 16.6879C17.1857 16.6565 16.7179 16.7719 16.6228 16.7961C16.3187 16.8735 16.1455 16.9278 16.0623 16.9747C16.0546 16.9791 16.0489 16.9827 16.0453 16.9849L16.0453 16.985C16.0416 16.9873 16.0402 16.9882 16.0409 16.9871L15.8082 16.8181C15.8352 16.7809 15.8727 16.7514 15.9211 16.7241C16.0352 16.6598 16.2204 16.6017 16.5519 16.5174C16.6462 16.4934 17.0994 16.3816 16.9968 16.407C17.183 16.3609 17.3247 16.3245 17.4634 16.2867C17.5047 16.2755 17.5451 16.2642 17.5846 16.253C17.5514 15.9472 17.59 15.6303 17.7985 15.2771C17.7985 15.2771 17.8892 15.8287 17.9508 16.1409C18.1348 16.0794 18.2932 16.0173 18.4301 15.9517C18.4763 15.9295 18.5224 15.9048 18.5684 15.8776C18.5868 15.5656 18.6785 15.2552 18.9495 14.9385C18.9495 14.9385 18.9455 15.2891 18.947 15.593C19.136 15.4204 19.3196 15.2058 19.4946 14.9538L19.372 15.0187C19.3585 14.6296 19.4185 14.2461 19.7551 13.8527C19.7551 13.8527 19.7507 14.232 19.7528 14.5435C19.8621 14.3526 19.9668 14.1464 20.0661 13.9262C19.9739 13.6237 19.9517 13.2977 20.0998 12.9027C20.0998 12.9027 20.1878 13.1535 20.2802 13.4065C20.3072 13.3346 20.3337 13.2615 20.3596 13.1873C20.1711 12.8707 20.05 12.5202 20.1399 12.0376C20.1399 12.0376 20.3543 12.419 20.5177 12.6954C20.5289 12.6578 20.5398 12.6198 20.5507 12.5817C20.585 12.4606 20.6128 12.3381 20.6339 12.2144C20.3652 11.9867 20.1479 11.703 20.0708 11.2396C20.0708 11.2396 20.4302 11.5483 20.6806 11.753C20.6841 11.6501 20.683 11.5464 20.6772 11.4419C20.3878 11.2662 20.1386 11.0264 19.9882 10.6005C19.9882 10.6005 20.3426 10.8106 20.6193 10.9671C20.5996 10.8624 20.5754 10.7571 20.5464 10.6512L20.546 10.6614C20.2023 10.4785 19.9002 10.2348 19.7278 9.74659C19.7278 9.74659 20.0839 9.9577 20.3609 10.1144C20.325 10.0284 20.286 9.942 20.2439 9.85533C20.1938 9.75228 20.1228 9.62931 20.0309 9.48663C19.724 9.38942 19.4383 9.22089 19.1954 8.86669C19.1954 8.86669 19.4408 8.93548 19.6953 9.00359C19.5477 8.80263 19.3746 8.57779 19.1762 8.32936L19.4009 8.14985C19.4827 8.25223 19.5603 8.35073 19.6337 8.44538Z" fill="#5AB92D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.4174 9.32297L14.6245 12.5222H13.7372C13.7372 12.5222 13.4174 13.5318 14.0209 13.5318C14.6245 13.5318 17.7349 13.5318 17.7349 13.5318C17.7349 13.5318 18.1393 13.2787 17.9371 12.5222C17.7349 11.7657 16.7133 9.67747 16.7133 9.67747C16.7133 9.67747 17.1499 9.3309 17.1499 9.07401C17.1499 8.81711 16.7133 8.78882 16.7133 8.78882H13.9578C13.6061 8.84582 13.4174 9.32297 13.4174 9.32297Z" fill="#EFE298"/>
<path d="M14.444 10.5008L16.3189 10.3843L14.444 10.5008Z" fill="#C5A042"/>
<path d="M14.444 10.5008L16.3189 10.3843" stroke="#B47D00" stroke-width="0.5"/>
<path d="M14.9003 11.5211L16.7752 11.4047L14.9003 11.5211Z" fill="#C5A042"/>
<path d="M14.9003 11.5211L16.7752 11.4047" stroke="#B47D00" stroke-width="0.5"/>
<path d="M15.2566 12.5414L17.1315 12.425L15.2566 12.5414Z" fill="#C5A042"/>
<path d="M15.2566 12.5414L17.1315 12.425" stroke="#B47D00" stroke-width="0.5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.8805 7.58762C15.8805 7.58762 15.5917 7.64627 15.5917 7.82868C15.5917 8.01109 15.5137 8.16662 15.5137 8.16662C15.5137 8.16662 15.6018 8.99859 16.2601 9.19165C16.9185 9.38471 17.3044 9.43107 17.5816 9.81834C17.8587 10.2056 18.7089 11.2989 18.3679 12.2419C18.027 13.1848 17.7593 13.6659 17.7593 13.6659C17.7593 13.6659 19.0029 12.4945 19.0029 11.9392C19.0029 11.3838 18.8191 10.8457 18.2682 10.1405C17.7172 9.43528 17.4609 9.02304 17.0505 8.70531C16.64 8.38758 16.0519 8.09439 16.0519 8.09439C16.0519 8.09439 16.2612 7.87056 16.1565 7.76532C16.0519 7.66008 15.8805 7.58762 15.8805 7.58762Z" fill="#5AB92D"/>
</g>
<defs>
<clipPath id="clip0_270_67392">
<rect width="32" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
`

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function OnboardingLayout() {
  return (
    <OnboardingScreen />
  );
}

export function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es'>('en');
  const scrollX = useSharedValue(0);
  const buttonColor = useSharedValue(colors.primary);
  const flatListRef = useRef<Animated.FlatList<{key: string}>>(null);

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await loadSavedLanguage();
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        setSelectedLanguage(savedLanguage as 'en' | 'es');
      }
    };
    
    loadLanguage();
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onStepChange = (index: number) => {
    setCurrentStep(index);
    // Animate button color when step changes
    buttonColor.value = withTiming(
      index === 2 ? '#4CAF50' : colors.primary,
      { duration: 300 }
    );
  };

  const goToNextStep = () => {
    if (currentStep < 2) {
      flatListRef.current?.scrollToIndex({
        index: currentStep + 1,
        animated: true
      });
      setCurrentStep(currentStep + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    router.replace('/auth' as any);
  };

  const handleLanguageChange = async (language: 'en' | 'es') => {
    setSelectedLanguage(language);
    await changeLanguage(language);
  };

  const renderDots = () => {
    return (
      <View style={styles.pagination}>
        {[0, 1, 2].map((_, i) => {
          const dotStyle = useAnimatedStyle(() => {
            const inputRange = [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH];
            const dotWidth = interpolate(
              scrollX.value,
              inputRange,
              [10, 35, 10],
              Extrapolate.CLAMP
            );
            
            return {
              width: withSpring(dotWidth, {
                damping: 15,
                stiffness: 100,
                mass: 0.5
              })
            };
          });

          const dotColorStyle = useAnimatedStyle(() => {
            const inputRange = [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH];
            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.5, 1, 0.5],
              Extrapolate.CLAMP
            );
            
            return {
              opacity,
              backgroundColor: colors.primary
            };
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                dotStyle,
                dotColorStyle
              ]}
            />
          );
        })}
      </View>
    );
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: buttonColor.value
    };
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image 
            source={require('../../assets/images/LogoMaycom.png')}
            style={styles.logoImage}
            resizeMode="contain"
        />
        <Text style={[styles.title, { color: colors.text }]}>
          {t('onboarding.title')}
        </Text>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={[{ key: '1' }, { key: '2' }, { key: '3' }]}
        renderItem={({ index }) => {
          return (
            <View style={{ width: SCREEN_WIDTH }}>
              {index === 0 && <StepOne />}
              {index === 1 && <StepTwo />}
              {index === 2 && <StepThree />}
            </View>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={onScroll}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          onStepChange(newIndex);
        }}
        scrollEventThrottle={16}
      />

      {renderDots()}
      
      <View style={styles.languageSelectorContainer}>
        <TouchableOpacity 
          style={[
            styles.languageOption, 
            selectedLanguage === 'en' && styles.selectedLanguage,
            { 
              borderColor: colors.primary,
              backgroundColor: selectedLanguage === 'en' 
                ? colors.primary + '20'
                : colors.background
            }
          ]}
          onPress={() => handleLanguageChange('en')}
        >
          <SvgXml xml={UsFlagSvg} width={24} height={24} />
          <Text style={[
            styles.languageText, 
            { 
              color: colors.text,
              opacity: selectedLanguage === 'en' ? 1 : 0.6
            }
          ]}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.languageOption, 
            selectedLanguage === 'es' && styles.selectedLanguage,
            { 
              borderColor: colors.primary,
              backgroundColor: selectedLanguage === 'es' 
                ? colors.primary + '20'
                : colors.background
            }
          ]}
          onPress={() => handleLanguageChange('es')}
        >
          <SvgXml xml={GtFlagSvg} width={24} height={24} />
          <Text style={[
            styles.languageText, 
            { 
              color: colors.text,
              opacity: selectedLanguage === 'es' ? 1 : 0.6
            }
          ]}>Español</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.button, buttonAnimatedStyle]}>
          <TouchableOpacity 
            style={styles.buttonTouchable}
            onPress={goToNextStep}
          >
            <Text style={styles.buttonText}>
              {currentStep === 2 ? t('onboarding.getStarted') : t('onboarding.next')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonTouchable: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoImage: {
    width: '15%',
    height: 100,
  },
  languageSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    minWidth: "43%",
    justifyContent: 'center',
  },
  selectedLanguage: {
    borderWidth: 2,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 