/**
 * Languages offered by the site's machine-translation option.
 *
 * Built from the languages the owner supplied (languages.txt) and matched against Google Cloud Translation's
 * published language list (page last updated 2026-10-22). Only languages Google can machine-translate
 * are offered; the rest are listed in UNAVAILABLE_LANGUAGES so the picker can be honest about them.
 * Urdu is supported by Google but deliberately left out at the owner's request.
 *
 * Codes use the older widget-compatible forms where Google accepts two (jw for Javanese, tl for Filipino).
 */
export type LanguageGroup = 'india-scheduled' | 'india-other' | 'world';

export interface LanguageOption {
  code: string;
  /** English name */
  name: string;
  /** Name in the language itself (never translated) */
  native: string;
  group: LanguageGroup;
  rtl?: boolean;
}

export const SOURCE_LANGUAGE = 'en';

export const GROUP_LABELS: Record<LanguageGroup, string> = {
  'india-scheduled': 'Indian languages (Eighth Schedule)',
  'india-other': 'Other Indian languages',
  world: 'World languages',
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', group: 'india-scheduled' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', group: 'india-scheduled' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', group: 'india-scheduled' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', group: 'india-scheduled' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', group: 'india-scheduled' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', group: 'india-scheduled' },
  { code: 'gom', name: 'Konkani', native: 'कोंकणी', group: 'india-scheduled' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', group: 'india-scheduled' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', group: 'india-scheduled' },
  { code: 'mni-Mtei', name: 'Manipuri (Meitei)', native: 'ꯃꯤꯇꯩꯂꯣꯟ', group: 'india-scheduled' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', group: 'india-scheduled' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', group: 'india-scheduled' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', group: 'india-scheduled' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', group: 'india-scheduled' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', group: 'india-scheduled' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', group: 'india-scheduled', rtl: true },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', group: 'india-scheduled' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', group: 'india-scheduled' },
  { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी', group: 'india-other' },
  { code: 'awa', name: 'Awadhi', native: 'अवधी', group: 'india-other' },
  { code: 'lus', name: 'Mizo', native: 'Mizo ṭawng', group: 'india-other' },
  { code: 'pa-Arab', name: 'Punjabi (Shahmukhi)', native: 'پنجابی', group: 'world', rtl: true },
  { code: 'es', name: 'Spanish', native: 'Español', group: 'world' },
  { code: 'fr', name: 'French', native: 'Français', group: 'world' },
  { code: 'de', name: 'German', native: 'Deutsch', group: 'world' },
  { code: 'it', name: 'Italian', native: 'Italiano', group: 'world' },
  { code: 'pt', name: 'Portuguese', native: 'Português', group: 'world' },
  { code: 'ru', name: 'Russian', native: 'Русский', group: 'world' },
  { code: 'zh-CN', name: 'Chinese, Mandarin (Simplified)', native: '简体中文', group: 'world' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文', group: 'world' },
  { code: 'yue', name: 'Cantonese', native: '粵語', group: 'world' },
  { code: 'ug', name: 'Uyghur', native: 'ئۇيغۇرچە', group: 'world', rtl: true },
  { code: 'ja', name: 'Japanese', native: '日本語', group: 'world' },
  { code: 'ko', name: 'Korean', native: '한국어', group: 'world' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', group: 'world' },
  { code: 'jw', name: 'Javanese', native: 'Basa Jawa', group: 'world' },
  { code: 'su', name: 'Sundanese', native: 'Basa Sunda', group: 'world' },
  { code: 'ban', name: 'Balinese', native: 'Basa Bali', group: 'world' },
  { code: 'ps', name: 'Pashto', native: 'پښتو', group: 'world', rtl: true },
  { code: 'fa', name: 'Persian', native: 'فارسی', group: 'world', rtl: true },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', group: 'world' },
  { code: 'ku', name: 'Kurdish (Kurmanji)', native: 'Kurdî', group: 'world' },
  { code: 'ckb', name: 'Kurdish (Sorani)', native: 'کوردی', group: 'world', rtl: true },
  { code: 'uz', name: 'Uzbek', native: 'Oʻzbek', group: 'world' },
  { code: 'tk', name: 'Turkmen', native: 'Türkmen', group: 'world' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', group: 'world' },
  { code: 'ar', name: 'Arabic', native: 'العربية', group: 'world', rtl: true },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', group: 'world' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', group: 'world' },
  { code: 'gd', name: 'Scottish Gaelic', native: 'Gàidhlig', group: 'world' },
  { code: 'br', name: 'Breton', native: 'Brezhoneg', group: 'world' },
  { code: 'oc', name: 'Occitan', native: 'Occitan', group: 'world' },
  { code: 'co', name: 'Corsican', native: 'Corsu', group: 'world' },
  { code: 'ca', name: 'Catalan', native: 'Català', group: 'world' },
  { code: 'gl', name: 'Galician', native: 'Galego', group: 'world' },
  { code: 'eu', name: 'Basque', native: 'Euskara', group: 'world' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', group: 'world' },
  { code: 'li', name: 'Limburgish', native: 'Limburgs', group: 'world' },
  { code: 'fy', name: 'Frisian', native: 'Frysk', group: 'world' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', group: 'world' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', group: 'world' },
  { code: 'mi', name: 'Māori', native: 'Te Reo Māori', group: 'world' },
  { code: 'haw', name: 'Hawaiian', native: 'ʻŌlelo Hawaiʻi', group: 'world' },
  { code: 'qu', name: 'Quechua', native: 'Runasimi', group: 'world' },
  { code: 'ay', name: 'Aymara', native: 'Aymar aru', group: 'world' },
  { code: 'gn', name: 'Guarani', native: 'Avañeʼẽ', group: 'world' },
  { code: 'yua', name: 'Yucatec Maya', native: 'Maayat\'aan', group: 'world' },
  { code: 'ha', name: 'Hausa', native: 'Hausa', group: 'world' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá', group: 'world' },
  { code: 'ig', name: 'Igbo', native: 'Igbo', group: 'world' },
  { code: 'ff', name: 'Fulfulde', native: 'Fulfulde', group: 'world' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', group: 'world' },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa', group: 'world' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', group: 'world' },
  { code: 'st', name: 'Sesotho', native: 'Sesotho', group: 'world' },
  { code: 'tn', name: 'Setswana', native: 'Setswana', group: 'world' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', group: 'world' },
  { code: 'luo', name: 'Luo', native: 'Dholuo', group: 'world' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', group: 'world' },
  { code: 'om', name: 'Oromo', native: 'Afaan Oromoo', group: 'world' },
  { code: 'so', name: 'Somali', native: 'Soomaali', group: 'world' },
  { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ', group: 'world' },
  { code: 'tl', name: 'Filipino', native: 'Filipino', group: 'world' },
  { code: 'ceb', name: 'Cebuano', native: 'Cebuano', group: 'world' },
  { code: 'ilo', name: 'Ilocano', native: 'Ilokano', group: 'world' },
  { code: 'hil', name: 'Hiligaynon', native: 'Hiligaynon', group: 'world' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', group: 'world' },
  { code: 'th', name: 'Thai', native: 'ไทย', group: 'world' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', group: 'world' },
  { code: 'hmn', name: 'Hmong', native: 'Hmoob', group: 'world' },
  { code: 'km', name: 'Khmer', native: 'ខ្មែរ', group: 'world' },
  { code: 'tt', name: 'Tatar', native: 'Татарча', group: 'world' },
  { code: 'ba', name: 'Bashkir', native: 'Башҡортса', group: 'world' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල', group: 'world' },
  { code: 'new', name: 'Newar (Nepalbhasa)', native: 'नेपाल भाषा', group: 'world' },
];

export const UNAVAILABLE_LANGUAGES: { group: string; names: string }[] = [
  { group: 'North India', names: 'Haryanvi, Rajasthani, Marwari, Braj, Garhwali, Kumaoni, Himachali varieties' },
  { group: 'Bihar and Jharkhand', names: 'Magahi, Angika, Khortha, Kurmali, Mundari, Ho, Kurukh' },
  { group: 'Maharashtra and central India', names: 'Ahirani, Varhadi, Malvani, Gondi, Korku, Bhili, Pawri' },
  { group: 'Gujarat and western India', names: 'Kutchi, Wagdi, Dangi' },
  { group: 'South India', names: 'Tulu, Kodava, Toda, Badaga, Irula, Lambadi' },
  { group: 'Northeast India', names: 'Khasi, Garo, Kokborok, Ao, Angami, Nyishi, Adi, Apatani, Lepcha, Mising, Karbi' },
  { group: 'Himalayan region', names: 'Ladakhi, Balti, Bhoti varieties, Shina, Gojri' },
  { group: 'Andaman and Nicobar Islands', names: 'Great Andamanese varieties, Onge, Jarawa, Shompen' },
  { group: 'Scheduled languages of India', names: 'Bodo, Kashmiri, Santali' },
  { group: 'Other countries', names: 'Navajo, Cherokee, Scots, Inuktitut, Cree, Ojibwe, Wu, Min, Tibetan, Ryukyuan languages, Ainu, Madurese, Balochi, Saraiki, Chakma, Marma, Tamang, Tharu, Low German, Upper Sorbian, North Frisian, Sardinian, Friulian, Ladin, Chechen, Sakha, Kaingang, Tikuna, Nahuatl, Mixtec, Zapotec, Kikuyu, Kalenjin, Afar, Pitjantjatjara, Yolŋu languages, Warlpiri, Tok Pisin, Hiri Motu, Waray, Iban, Isan, Northern Thai, Pattani Malay, Tày, Luri, Dari (use Persian), Zazaki, Siwi, Romansh, Meänkieli, Sami languages, Mapudungun, Asháninka, and sign languages (Korean Sign Language, New Zealand Sign Language)' },
];

/** Extra codes Google also accepts for the same language; passed to the widget so either spelling works. */
const CODE_ALIASES = ['jv', 'fil', 'zh'];

export function widgetLanguageList(): string {
  return [...SUPPORTED_LANGUAGES.map((l) => l.code), ...CODE_ALIASES].join(',');
}

export function findLanguage(code: string | null | undefined): LanguageOption | undefined {
  if (!code) return undefined;
  return SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase());
}

/** Case-insensitive match on English or native name, or on the code. */
export function searchLanguages(query: string): LanguageOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return SUPPORTED_LANGUAGES;
  return SUPPORTED_LANGUAGES.filter(
    (l) => l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.toLowerCase() === q
  );
}
