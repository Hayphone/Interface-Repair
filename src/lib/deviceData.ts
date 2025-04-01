// Données des appareils Samsung avec leurs références techniques
export interface DeviceModel {
  id: string;
  name: string;
  modelNumber?: string;
}

export interface DeviceCategory {
  title: string;
  devices: DeviceModel[];
}

export interface BrandCategory {
  name: string;
  categories: DeviceCategory[];
}

// Données des appareils Samsung
export const samsungDevices: DeviceCategory[] = [
  {
    title: 'Galaxy S',
    devices: [
      { id: 'galaxys24ultra', name: 'Galaxy S24 Ultra', modelNumber: 'S928B' },
      { id: 'galaxys24plus', name: 'Galaxy S24+', modelNumber: 'S926B' },
      { id: 'galaxys24', name: 'Galaxy S24', modelNumber: 'S921B' },
      { id: 'galaxys23ultra', name: 'Galaxy S23 Ultra', modelNumber: 'S918B' },
      { id: 'galaxys23plus', name: 'Galaxy S23+', modelNumber: 'S916B' },
      { id: 'galaxys23', name: 'Galaxy S23', modelNumber: 'S911B' },
      { id: 'galaxys22ultra', name: 'Galaxy S22 Ultra', modelNumber: 'S908B' },
      { id: 'galaxys22plus', name: 'Galaxy S22+', modelNumber: 'S906B' },
      { id: 'galaxys22', name: 'Galaxy S22', modelNumber: 'S901B' },
      { id: 'galaxys21ultra', name: 'Galaxy S21 Ultra', modelNumber: 'G998B' },
      { id: 'galaxys21plus', name: 'Galaxy S21+', modelNumber: 'G996B' },
      { id: 'galaxys21', name: 'Galaxy S21', modelNumber: 'G991B' },
    ]
  },
  {
    title: 'Galaxy Z',
    devices: [
      { id: 'galaxyzfold5', name: 'Galaxy Z Fold 5', modelNumber: 'F946B' },
      { id: 'galaxyzflip5', name: 'Galaxy Z Flip 5', modelNumber: 'F731B' },
      { id: 'galaxyzfold4', name: 'Galaxy Z Fold 4', modelNumber: 'F936B' },
      { id: 'galaxyzflip4', name: 'Galaxy Z Flip 4', modelNumber: 'F721B' },
      { id: 'galaxyzfold3', name: 'Galaxy Z Fold 3', modelNumber: 'F926B' },
      { id: 'galaxyzflip3', name: 'Galaxy Z Flip 3', modelNumber: 'F711B' },
    ]
  },
  {
    title: 'Galaxy A',
    devices: [
      { id: 'galaxya80', name: 'Galaxy A80', modelNumber: 'A805F' },
      { id: 'galaxya72', name: 'Galaxy A72', modelNumber: 'A725F/A726B' },
      { id: 'galaxya71', name: 'Galaxy A71', modelNumber: 'A715F' },
      { id: 'galaxya70', name: 'Galaxy A70', modelNumber: 'A705F' },
      { id: 'galaxya55', name: 'Galaxy A55 5G', modelNumber: 'A556B' },
      { id: 'galaxya54', name: 'Galaxy A54 5G', modelNumber: 'A546B' },
      { id: 'galaxya53', name: 'Galaxy A53 5G', modelNumber: 'A536B' },
      { id: 'galaxya52s', name: 'Galaxy A52S 5G', modelNumber: 'A528B' },
      { id: 'galaxya52', name: 'Galaxy A52', modelNumber: 'A525F/A526B' },
      { id: 'galaxya51_5g', name: 'Galaxy A51 5G', modelNumber: 'A516B' },
      { id: 'galaxya51', name: 'Galaxy A51', modelNumber: 'A515F' },
      { id: 'galaxya50s', name: 'Galaxy A50s', modelNumber: 'A507F' },
      { id: 'galaxya50', name: 'Galaxy A50', modelNumber: 'A505F' },
      { id: 'galaxya42', name: 'Galaxy A42 5G', modelNumber: 'A426B' },
      { id: 'galaxya41', name: 'Galaxy A41', modelNumber: 'A415F' },
      { id: 'galaxya40', name: 'Galaxy A40', modelNumber: 'A405F' },
      { id: 'galaxya35', name: 'Galaxy A35 5G', modelNumber: 'A356B' },
      { id: 'galaxya34', name: 'Galaxy A34 5G', modelNumber: 'A346B' },
      { id: 'galaxya33', name: 'Galaxy A33 5G', modelNumber: 'A336B' },
      { id: 'galaxya32_5g', name: 'Galaxy A32 5G', modelNumber: 'A326B' },
      { id: 'galaxya32_4g', name: 'Galaxy A32 4G', modelNumber: 'A325F' },
      { id: 'galaxya31', name: 'Galaxy A31', modelNumber: 'A315F' },
      { id: 'galaxya30s', name: 'Galaxy A30s', modelNumber: 'A307F' },
      { id: 'galaxya30', name: 'Galaxy A30', modelNumber: 'A305F' },
      { id: 'galaxya25', name: 'Galaxy A25 5G', modelNumber: 'A256B' },
      { id: 'galaxya24', name: 'Galaxy A24 4G', modelNumber: 'A245F' },
      { id: 'galaxya23_5g', name: 'Galaxy A23 5G', modelNumber: 'A236B' },
      { id: 'galaxya23_4g', name: 'Galaxy A23 4G', modelNumber: 'A235F' },
      { id: 'galaxya22_5g', name: 'Galaxy A22 5G', modelNumber: 'A226B' },
      { id: 'galaxya22_4g', name: 'Galaxy A22 4G', modelNumber: 'A225F' },
      { id: 'galaxya21s', name: 'Galaxy A21s', modelNumber: 'A217F' },
      { id: 'galaxya20s', name: 'Galaxy A20s', modelNumber: 'A207F' },
      { id: 'galaxya20e', name: 'Galaxy A20e', modelNumber: 'A202F' },
      { id: 'galaxya20', name: 'Galaxy A20', modelNumber: 'A205F' },
      { id: 'galaxya16_5g', name: 'Galaxy A16 5G', modelNumber: 'A166B' },
      { id: 'galaxya16_4g', name: 'Galaxy A16 4G', modelNumber: 'A165F' },
      { id: 'galaxya15_5g', name: 'Galaxy A15 5G', modelNumber: 'A156B' },
      { id: 'galaxya15_4g', name: 'Galaxy A15 4G', modelNumber: 'A155F' },
      { id: 'galaxya14_5g', name: 'Galaxy A14 5G', modelNumber: 'A146' },
      { id: 'galaxya14_4g', name: 'Galaxy A14 4G', modelNumber: 'A145' },
      { id: 'galaxya13_5g', name: 'Galaxy A13 5G', modelNumber: 'A136B' },
      { id: 'galaxya13_4g', name: 'Galaxy A13 4G', modelNumber: 'A135F/A137F' },
      { id: 'galaxya12s', name: 'Galaxy A12s', modelNumber: 'A127F' },
      { id: 'galaxya12', name: 'Galaxy A12', modelNumber: 'A125F' },
      { id: 'galaxya11', name: 'Galaxy A11', modelNumber: 'A115F' },
      { id: 'galaxya10s', name: 'Galaxy A10s', modelNumber: 'A107F' },
      { id: 'galaxya10', name: 'Galaxy A10', modelNumber: 'A105F' },
      { id: 'galaxya06', name: 'Galaxy A06', modelNumber: 'A065F' },
      { id: 'galaxya05s', name: 'Galaxy A05S', modelNumber: 'A057F' },
      { id: 'galaxya04s', name: 'Galaxy A04s', modelNumber: 'A047F' },
      { id: 'galaxya03s', name: 'Galaxy A03s', modelNumber: 'A037G' },
      { id: 'galaxya03core', name: 'Galaxy A03 Core', modelNumber: 'A032F' },
      { id: 'galaxya03', name: 'Galaxy A03', modelNumber: 'A035G' },
      { id: 'galaxya02s', name: 'Galaxy A02s', modelNumber: 'A025G' },
      { id: 'galaxya01core', name: 'Galaxy A01 Core', modelNumber: 'A013F' },
      { id: 'galaxya01', name: 'Galaxy A01', modelNumber: 'A015F' },
      { id: 'galaxya9_2018', name: 'Galaxy A9 2018', modelNumber: 'A920F' },
      { id: 'galaxya8plus_2018', name: 'Galaxy A8+ 2018', modelNumber: 'A730F' },
      { id: 'galaxya8_2018', name: 'Galaxy A8 2018', modelNumber: 'A530F' },
      { id: 'galaxya7_2018', name: 'Galaxy A7 2018', modelNumber: 'A750F' },
      { id: 'galaxya6plus_2018', name: 'Galaxy A6+ 2018', modelNumber: 'A605F' },
      { id: 'galaxya6_2018', name: 'Galaxy A6 2018', modelNumber: 'A600F' },
      { id: 'galaxya5_2017', name: 'Galaxy A5 2017', modelNumber: 'A520F' },
      { id: 'galaxya5_2016', name: 'Galaxy A5 2016', modelNumber: 'A510F' },
      { id: 'galaxya3_2017', name: 'Galaxy A3 2017', modelNumber: 'A320F' },
      { id: 'galaxya3_2016', name: 'Galaxy A3 2016', modelNumber: 'A310F' },
      { id: 'galaxya36', name: 'Galaxy A36 5G', modelNumber: 'A366B' },
      { id: 'galaxya56', name: 'Galaxy A56 5G', modelNumber: 'A566B' },
    ]
  },
  {
    title: 'Galaxy M',
    devices: [
      { id: 'galaxym53', name: 'Galaxy M53 5G', modelNumber: 'M536B' },
      { id: 'galaxym52', name: 'Galaxy M52', modelNumber: 'M526B' },
      { id: 'galaxym51', name: 'Galaxy M51', modelNumber: 'M515F' },
      { id: 'galaxym33', name: 'Galaxy M33 5G', modelNumber: 'M336B' },
      { id: 'galaxym31', name: 'Galaxy M31', modelNumber: 'M315F' },
      { id: 'galaxym30s', name: 'Galaxy M30S', modelNumber: 'M307F' },
      { id: 'galaxym30', name: 'Galaxy M30', modelNumber: 'M305F' },
      { id: 'galaxym23', name: 'Galaxy M23', modelNumber: 'M236B' },
      { id: 'galaxym22', name: 'Galaxy M22', modelNumber: 'M225F' },
      { id: 'galaxym21', name: 'Galaxy M21', modelNumber: 'M215F' },
      { id: 'galaxym20', name: 'Galaxy M20', modelNumber: 'M205F' },
      { id: 'galaxym13', name: 'Galaxy M13', modelNumber: 'M135F' },
      { id: 'galaxym12', name: 'Galaxy M12', modelNumber: 'M127F' },
      { id: 'galaxym11', name: 'Galaxy M11', modelNumber: 'M115F' },
      { id: 'galaxym10', name: 'Galaxy M10', modelNumber: 'M105F' },
    ]
  },
  {
    title: 'Galaxy Note',
    devices: [
      { id: 'galaxynote20ultra', name: 'Galaxy Note 20 Ultra', modelNumber: 'N985F/986B' },
      { id: 'galaxynote20', name: 'Galaxy Note 20', modelNumber: 'N980F' },
      { id: 'galaxynote10plus', name: 'Galaxy Note 10+', modelNumber: 'N975F/N976B' },
      { id: 'galaxynote10lite', name: 'Galaxy Note 10 Lite', modelNumber: 'N770F' },
      { id: 'galaxynote10', name: 'Galaxy Note 10', modelNumber: 'N970F' },
      { id: 'galaxynote9', name: 'Galaxy Note 9', modelNumber: 'N960F' },
      { id: 'galaxynote8', name: 'Galaxy Note 8', modelNumber: 'N950F' },
    ]
  },
  {
    title: 'Galaxy J',
    devices: [
      { id: 'galaxyj8_2018', name: 'Galaxy J8 2018', modelNumber: 'J810F' },
      { id: 'galaxyj7_2017', name: 'Galaxy J7 2017', modelNumber: 'J730F' },
      { id: 'galaxyj7_2016', name: 'Galaxy J7 2016', modelNumber: 'J710F' },
      { id: 'galaxyj6plus_2018', name: 'Galaxy J6+ 2018', modelNumber: 'J610F' },
      { id: 'galaxyj6_2018', name: 'Galaxy J6 2018', modelNumber: 'J600F' },
      { id: 'galaxyj5_2017', name: 'Galaxy J5 2017', modelNumber: 'J530F' },
      { id: 'galaxyj5_2016', name: 'Galaxy J5 2016', modelNumber: 'J510F' },
      { id: 'galaxyj4plus_2018', name: 'Galaxy J4+ 2018', modelNumber: 'J415F' },
      { id: 'galaxyj3_2017', name: 'Galaxy J3 2017', modelNumber: 'J330F' },
      { id: 'galaxyj3_2016', name: 'Galaxy J3 2016', modelNumber: 'J320F' },
      { id: 'galaxyj2_2018', name: 'Galaxy J2 2018', modelNumber: 'J250F' },
    ]
  },
  {
    title: 'Galaxy Tab',
    devices: [
      { id: 'galaxytabs9ultra', name: 'Galaxy Tab S9 Ultra', modelNumber: 'X986B' },
      { id: 'galaxytabs9plus', name: 'Galaxy Tab S9+', modelNumber: 'X916B' },
      { id: 'galaxytabs9', name: 'Galaxy Tab S9', modelNumber: 'X716B' },
      { id: 'galaxytabs8ultra', name: 'Galaxy Tab S8 Ultra', modelNumber: 'X906B' },
      { id: 'galaxytabs8plus', name: 'Galaxy Tab S8+', modelNumber: 'X806B' },
      { id: 'galaxytabs8', name: 'Galaxy Tab S8', modelNumber: 'X706B' },
    ]
  }
];

// Données des appareils Apple avec tous les numéros de modèle
export const appleDevices: DeviceCategory[] = [
  {
    title: 'iPhone',
    devices: [
      { id: 'iphone16e', name: 'iPhone 16e', modelNumber: 'A3212, A3409, A3410, A3408' },
      { id: 'iphone16', name: 'iPhone 16', modelNumber: 'A3287, A3081, A3286, A3288' },
      { id: 'iphone16plus', name: 'iPhone 16 Plus', modelNumber: 'A3290, A3082, A3289, A3291' },
      { id: 'iphone16pro', name: 'iPhone 16 Pro', modelNumber: 'A3293, A3083, A3292, A3294' },
      { id: 'iphone16promax', name: 'iPhone 16 Pro Max', modelNumber: 'A3296, A3084, A3295, A3297' },
      { id: 'iphone15', name: 'iPhone 15', modelNumber: 'A3090, A2846, A3089, A3092' },
      { id: 'iphone15plus', name: 'iPhone 15 Plus', modelNumber: 'A3094, A2847, A3093, A3096' },
      { id: 'iphone15pro', name: 'iPhone 15 Pro', modelNumber: 'A2848, A3101, A3102, A3104' },
      { id: 'iphone15promax', name: 'iPhone 15 Pro Max', modelNumber: 'A2849, A3105, A3106, A3108' },
      { id: 'iphone14', name: 'iPhone 14', modelNumber: 'A2882, A2649, A2881, A2884, A2883' },
      { id: 'iphone14plus', name: 'iPhone 14 Plus', modelNumber: 'A2886, A2632, A2885, A2896, A2887' },
      { id: 'iphone14pro', name: 'iPhone 14 Pro', modelNumber: 'A2890, A2650, A2889, A2892' },
      { id: 'iphone14promax', name: 'iPhone 14 Pro Max', modelNumber: 'A2894, A2651, A2893, A2895' },
      { id: 'iphonese2022', name: 'iPhone SE (2022)', modelNumber: 'A2783, A2595, A2785, A2782, A2784' },
      { id: 'iphone13promax', name: 'iPhone 13 Pro Max', modelNumber: 'A2643, A2484, A2641, A2644, A2645' },
      { id: 'iphone13pro', name: 'iPhone 13 Pro', modelNumber: 'A2638, A2483, A2636, A2639, A2640' },
      { id: 'iphone13mini', name: 'iPhone 13 Mini', modelNumber: 'A2628, A2481, A2626, A2629, A2630' },
      { id: 'iphone13', name: 'iPhone 13', modelNumber: 'A2633, A2482, A2631, A2634, A2635' },
      { id: 'iphone12promax', name: 'iPhone 12 Pro Max', modelNumber: 'A2411, A2342, A2410, A2412' },
      { id: 'iphone12pro', name: 'iPhone 12 Pro', modelNumber: 'A2407, A2341, A2406, A2408' },
      { id: 'iphone12', name: 'iPhone 12', modelNumber: 'A2403, A2172, A2402, A2404' },
      { id: 'iphone12mini', name: 'iPhone 12 Mini', modelNumber: 'A2399, A2176, A2398, A2400' },
      { id: 'iphonese2020', name: 'iPhone SE (2020)', modelNumber: 'A2296, A2275, A2298' },
      { id: 'iphone11promax', name: 'iPhone 11 Pro Max', modelNumber: 'A2218, A2161, A2220' },
      { id: 'iphone11pro', name: 'iPhone 11 Pro', modelNumber: 'A2160, A2215, A2217' },
      { id: 'iphone11', name: 'iPhone 11', modelNumber: 'A2111, A2221, A2223' },
      { id: 'iphonexsmax', name: 'iPhone XS Max', modelNumber: 'A1921, A2101, A2102, A2103, A2104' },
      { id: 'iphonexs', name: 'iPhone XS', modelNumber: 'A1920, A2097, A2098, A2099, A2100' },
      { id: 'iphonexr', name: 'iPhone XR', modelNumber: 'A1984, A2105, A2106, A2107, A2108' },
      { id: 'iphonex', name: 'iPhone X', modelNumber: 'A1865, A1901, A1902' },
      { id: 'iphone8plus', name: 'iPhone 8 Plus', modelNumber: 'A1864, A1897, A1898' },
      { id: 'iphone8', name: 'iPhone 8', modelNumber: 'A1863, A1905, A1906' },
      { id: 'iphone7plus', name: 'iPhone 7 Plus', modelNumber: 'A1661, A1784, A1785' },
      { id: 'iphone7', name: 'iPhone 7', modelNumber: 'A1660, A1778, A1779' },
      { id: 'iphonese2016', name: 'iPhone SE (2016)', modelNumber: 'A1723, A1662, A1724' },
      { id: 'iphone6splus', name: 'iPhone 6s Plus', modelNumber: 'A1634, A1687, A1699' },
      { id: 'iphone6s', name: 'iPhone 6s', modelNumber: 'A1633, A1688, A1700' },
      { id: 'iphone6plus', name: 'iPhone 6 Plus', modelNumber: 'A1522, A1524, A1593' },
      { id: 'iphone6', name: 'iPhone 6', modelNumber: 'A1549, A1586, A1589' },
      { id: 'iphone5s', name: 'iPhone 5S', modelNumber: 'A1453, A1457, A1518, A1528, A1530, A1533' },
      { id: 'iphone5c', name: 'iPhone 5C', modelNumber: 'A1456, A1507, A1516, A1529, A1532' },
      { id: 'iphone5', name: 'iPhone 5', modelNumber: 'A1428, A1429, A1442' },
      { id: 'iphone4s', name: 'iPhone 4S', modelNumber: 'A1431, A1387' },
      { id: 'iphone4', name: 'iPhone 4', modelNumber: 'A1349, A1332' },
    ]
  },
  {
    title: 'iPad Pro',
    devices: [
      { id: 'ipadpro13_2024', name: 'iPad Pro 13 (2024)', modelNumber: 'A2925, A2926, A3007' },
      { id: 'ipadpro12.9_2022', name: 'iPad Pro 12.9 (2022)', modelNumber: 'A2436, A2764, A2437, A2766' },
      { id: 'ipadpro12.9_2021', name: 'iPad Pro 12.9 (2021)', modelNumber: 'A2378, A2461, A2379, A2462' },
      { id: 'ipadpro12.9_2020', name: 'iPad Pro 12.9 (2020)', modelNumber: 'A2229, A2069, A2232, A2233' },
      { id: 'ipadpro12.9_2018', name: 'iPad Pro 12.9 (2018)', modelNumber: 'A1876, A2014, A1895, A1983' },
      { id: 'ipadpro12.9_2017', name: 'iPad Pro 12.9 (2017)', modelNumber: 'A1670, A1671, A1821' },
      { id: 'ipadpro12.9_2015', name: 'iPad Pro 12.9 (2015)', modelNumber: 'A1584, A1652' },
      { id: 'ipadpro11_2024', name: 'iPad Pro 11 (2024)', modelNumber: 'A2836, A2837, A3006' },
      { id: 'ipadpro11_2022', name: 'iPad Pro 11 (2022)', modelNumber: 'A2759, A2435, A2761, A2762' },
      { id: 'ipadpro11_2021', name: 'iPad Pro 11 (2021)', modelNumber: 'A2377, A2459, A2301, A2460' },
      { id: 'ipadpro11_2020', name: 'iPad Pro 11 (2020)', modelNumber: 'A2228, A2068, A2230, A2231' },
      { id: 'ipadpro11_2018', name: 'iPad Pro 11 (2018)', modelNumber: 'A1980, A2013, A1934, A1979' },
      { id: 'ipadpro10.5_2017', name: 'iPad Pro 10.5 (2017)', modelNumber: 'A1701, A1709, A1852' },
      { id: 'ipadpro9.7_2016', name: 'iPad Pro 9.7 (2016)', modelNumber: 'A1673, A1674, A1675' },
    ]
  },
  {
    title: 'iPad Air',
    devices: [
      { id: 'ipadair13_2025', name: 'iPad Air 13 (2025)', modelNumber: 'A3269, A3268, A3271' },
      { id: 'ipadair11_2025', name: 'iPad Air 11 (2025)', modelNumber: 'A3267, A3266, A3270' },
      { id: 'ipadair13_2024', name: 'iPad Air 13 (2024)', modelNumber: 'A2898, A2899, A2900' },
      { id: 'ipadair11_2024', name: 'iPad Air 11 (2024)', modelNumber: 'A2902, A2903, A2904' },
      { id: 'ipadair5_2022', name: 'iPad Air 5 (2022)', modelNumber: 'A2588, A2589, A2591' },
      { id: 'ipadair4_2020', name: 'iPad Air 4 (2020)', modelNumber: 'A2316, A2324, A2325, A2072' },
      { id: 'ipadair3_2019', name: 'iPad Air 3 (2019)', modelNumber: 'A2152, A2123, A2153, A2154' },
      { id: 'ipadair2_2014', name: 'iPad Air 2 (2014)', modelNumber: 'A1566, A1567' },
      { id: 'ipadair1_2013', name: 'iPad Air 1 (2013)', modelNumber: 'A1474, A1475, A1476' },
    ]
  },
  {
    title: 'iPad',
    devices: [
      { id: 'ipad11_2025', name: 'iPad 11 (2025)', modelNumber: 'A3355, A3356, A3354' },
      { id: 'ipad10_2022', name: 'iPad 10 (2022)', modelNumber: 'A2696, A2757, A2777' },
      { id: 'ipad9_2021', name: 'iPad 9 (2021)', modelNumber: 'A2602, A2604, A2603, A2605' },
      { id: 'ipad8_2020', name: 'iPad 8 (2020)', modelNumber: 'A2270, A2428, A2429, A2430' },
      { id: 'ipad7_2019', name: 'iPad 7 (2019)', modelNumber: 'A2197, A2200, A2198, A2199' },
      { id: 'ipad6_2018', name: 'iPad 6 (2018)', modelNumber: 'A1893, A1954' },
      { id: 'ipad5_2017', name: 'iPad 5 (2017)', modelNumber: 'A1822, A1823' },
      { id: 'ipad4_2012', name: 'iPad 4 (2012)', modelNumber: 'A1458, A1459, A1460' },
      { id: 'ipad3_2012', name: 'iPad 3 (2012)', modelNumber: 'A1416, A1430, A1403' },
      { id: 'ipad2_2011', name: 'iPad 2 (2011)', modelNumber: 'A1395, A1396, A1397' },
    ]
  },
  {
    title: 'iPad Mini',
    devices: [
      { id: 'ipadmini7_2024', name: 'iPad Mini 7 (2024)', modelNumber: 'A2993, A2995, A2996' },
      { id: 'ipadmini6_2021', name: 'iPad Mini 6 (2021)', modelNumber: 'A2567, A2568, A2569' },
      { id: 'ipadmini5_2019', name: 'iPad Mini 5 (2019)', modelNumber: 'A2133, A2124, A2126, A2125' },
      { id: 'ipadmini4_2015', name: 'iPad Mini 4 (2015)', modelNumber: 'A1538, A1550' },
      { id: 'ipadmini3_2014', name: 'iPad Mini 3 (2014)', modelNumber: 'A1599, A1600' },
      { id: 'ipadmini2_2013', name: 'iPad Mini 2 (2013)', modelNumber: 'A1489, A1490, A1491' },
      { id: 'ipadmini1_2012', name: 'iPad Mini 1 (2012)', modelNumber: 'A1432, A1454, A1455' },
    ]
  }
];

// Vous pouvez ajouter d'autres marques ici si nécessaire
