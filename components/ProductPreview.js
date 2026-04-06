'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

const PRODUCTS = [
  {
    id: 'impact-driver',
    name: 'Makita Impact Driver 18V',
    image: '/drill.png',
    specs: 'Brushless • Bare Unit • DTD154Z',
    store: 'Screwfix',
    storeStatus: 'Open now • Closes 8pm',
    price: '£157.95',
    distance: '4.2 mi',
    driveTime: '9 min drive',
    rating: '4.8★',
    collection: 'Ready in 5 mins',
    area: 'Birmingham City Centre',
    isOpenNow: true,
    stockLevel: 'in',
    stockQty: 12,
    valueTag: 'Fastest Collection',
    alternative: 'Cheaper alternative available nearby',
    vatInvoice: true,
    tradePricing: true,
    urgency: '',
  },
  {
    id: 'copper-pipe',
    name: 'Copper Pipe 15mm × 3m',
    image: '/15mmcopper.png',
    specs: 'EN1057 • 3m Length • Solder Ring Compatible',
    store: 'Toolstation',
    storeStatus: 'Open now • Closes 7pm',
    price: '£21.80',
    distance: '6.0 mi',
    driveTime: '12 min drive',
    rating: '4.6★',
    collection: 'Ready in 10 mins',
    area: 'Digbeth',
    isOpenNow: true,
    stockLevel: 'low',
    stockQty: 2,
    valueTag: 'Best Price Nearby',
    alternative: '',
    vatInvoice: true,
    tradePricing: true,
    urgency: 'Only 2 left',
  },
  {
    id: 'led-downlight',
    name: 'LED Downlight 6W Warm',
    image: '/downlight.png',
    specs: 'IP65 Rated • Warm White • Cutout 70mm',
    store: 'CEF Electrical',
    storeStatus: 'Closed • Opens 7am',
    price: '£8.75',
    distance: '3.1 mi',
    driveTime: '7 min drive',
    rating: '4.3★',
    collection: 'Ready in 20 mins',
    area: 'Jewellery Quarter',
    isOpenNow: false,
    stockLevel: 'out',
    stockQty: 0,
    valueTag: '',
    alternative: 'Cheaper alternative available nearby',
    vatInvoice: false,
    tradePricing: true,
    urgency: 'Selling fast',
  },
];

const SORT_GROUPS = [
  {
    label: 'Smart ranking',
    options: [{ value: 'best-match', label: 'Best Match', hint: 'Balanced price, distance & availability' }],
  },
  {
    label: 'By cost and travel',
    options: [
      { value: 'cheapest', label: 'Cheapest', hint: 'Lowest price nearby' },
      { value: 'closest', label: 'Closest', hint: 'Shortest travel distance' },
    ],
  },
  {
    label: 'By speed',
    options: [{ value: 'fastest-collection', label: 'Fastest Collection', hint: 'Quickest pickup time' }],
  },
];

const SORT_TINTS = {
  'best-match':         { idle: 'hover:bg-sky-500/[0.07]',    selected: 'bg-sky-500/14 border-sky-400/28 shadow-[inset_0_0_8px_rgba(56,189,248,0.08)]' },
  'cheapest':           { idle: 'hover:bg-emerald-500/[0.07]', selected: 'bg-emerald-500/12 border-emerald-400/25 shadow-[inset_0_0_8px_rgba(52,211,153,0.07)]' },
  'closest':            { idle: 'hover:bg-violet-500/[0.07]', selected: 'bg-violet-500/14 border-violet-400/28 shadow-[inset_0_0_8px_rgba(167,139,250,0.08)]' },
  'fastest-collection': { idle: 'hover:bg-amber-500/[0.07]',  selected: 'bg-amber-500/12 border-amber-400/25 shadow-[inset_0_0_8px_rgba(251,191,36,0.07)]' },
};

const DEFAULT_SEARCH_PROMPT = 'Makita Impact Driver 18V';
const DEFAULT_LOCATION_LABEL = 'Birmingham City Centre, B1';

const STOCK_STYLES = {
  in: 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/22',
  low: 'bg-[#FF9F43]/14 text-[#FFD8A8] border border-[#FF9F43]/28',
  backSoon: 'bg-[#FF9F43]/12 text-[#FFD8A8] border border-[#FF9F43]/22',
};

function getStockBadge(qty) {
  if (qty > 5) {
    return { label: 'In stock', tone: 'in' };
  }

  if (qty > 0) {
    return { label: `Only ${qty} left`, tone: 'low' };
  }

  return { label: 'Restocking soon', tone: 'backSoon' };
}

function toPriceNumber(priceText) {
  return Number(priceText.replace('£', ''));
}

function toDistanceNumber(distanceText) {
  return Number(distanceText.replace(' mi', ''));
}

function toCollectionMinutes(collectionText) {
  const match = collectionText.match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function getSortLabel(value) {
  for (const group of SORT_GROUPS) {
    const option = group.options.find((item) => item.value === value);
    if (option) {
      return option.label;
    }
  }

  return 'Best Match';
}

function getSecondaryBadgeClass(label) {
  if (label === 'Selling fast') {
    return 'border border-[#FF5050]/38 bg-[#FF5050]/12 text-[#FF8A8A]';
  }

  if (label === 'Fastest Collection') {
    return 'border border-[#38BDF8]/45 bg-[#38BDF8]/18 text-[#D7F0FF]';
  }

  if (label === 'Best Price Nearby') {
    return 'border border-[#FFB400]/45 bg-[#FFB400]/18 text-[#FFB400]';
  }

  if (label === 'Trade pricing available') {
    return 'border border-[#00C878]/35 bg-[#00C878]/12 text-[#4DE29F]';
  }

  if (label === 'VAT invoice available') {
    return 'border border-[#0096FF]/28 bg-[#0096FF]/10 text-[#84C8FF]';
  }

  return 'border border-slate-300/16 bg-slate-400/6 text-slate-300/70';
}

function getSearchableText(product) {
  return [product.name, product.specs, product.store, product.area, product.valueTag, product.alternative]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function formatLocationLabel(address = {}) {
  const area = address.city_district || address.suburb || address.neighbourhood || address.quarter || address.city || address.town || address.village || address.county;
  const postcode = address.postcode ? address.postcode.split(' ')[0] : '';

  if (area && postcode) {
    return `${area}, ${postcode}`;
  }

  if (area) {
    return area;
  }

  return DEFAULT_LOCATION_LABEL;
}

function parseSearchIntent(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return {
      sortBy: '',
      inStockOnly: false,
      openNowOnly: false,
      terms: [],
    };
  }

  const sortSignals = {
    'best-match': ['best', 'recommended', 'recommend'],
    cheapest: ['cheap', 'cheapest', 'budget', 'affordable', 'lowest price'],
    closest: ['close', 'closest', 'near', 'nearby', 'nearest', 'local'],
    'fastest-collection': ['fast', 'fastest', 'quick', 'quickest', 'pickup', 'collect', 'collection'],
  };

  let detectedSort = '';
  let highestScore = 0;

  Object.entries(sortSignals).forEach(([value, signals]) => {
    const score = signals.reduce((total, signal) => total + (normalizedQuery.includes(signal) ? 1 : 0), 0);
    if (score > highestScore) {
      highestScore = score;
      detectedSort = value;
    }
  });

  const openNowOnly = normalizedQuery.includes('open now') || normalizedQuery.includes('open ');
  const inStockOnly = normalizedQuery.includes('in stock') || normalizedQuery.includes('available') || normalizedQuery.includes('instock');

  const noiseTerms = [
    'best', 'recommended', 'recommend', 'cheap', 'cheapest', 'budget', 'affordable', 'lowest', 'price',
    'close', 'closest', 'near', 'nearby', 'nearest', 'local', 'fast', 'fastest', 'quick', 'quickest',
    'pickup', 'pick', 'up', 'collect', 'collection', 'open', 'now', 'in', 'stock', 'available', 'find',
    'show', 'me', 'for', 'the', 'a', 'an', 'please'
  ];

  const terms = normalizedQuery
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .filter((term) => !noiseTerms.includes(term));

  return {
    sortBy: detectedSort,
    inStockOnly,
    openNowOnly,
    terms,
  };
}

function EyeIcon() {
  return (
    <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
  );
}

function MicIcon({ listening = false }) {
  return (
    <svg className={`h-3.5 w-3.5 shrink-0 ${listening ? 'text-white' : 'text-brand-muted/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 0 1-14 0M12 18v3m-4 0h8" />
    </svg>
  );
}

function ActionBtn({ icon, label, variant = 'secondary' }) {
  let variantClass = 'border border-white/15 bg-white/[0.09] text-brand-muted/85 hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.14] hover:text-brand-text';

  if (variant === 'primary') {
    variantClass = 'border border-brand-orange/55 bg-brand-orange/85 text-white shadow-[0_8px_20px_rgba(249,115,22,0.28)] hover:-translate-y-px hover:bg-brand-orange hover:shadow-[0_10px_24px_rgba(249,115,22,0.36)]';
  } else if (variant === 'view') {
    variantClass = 'border border-white/16 bg-white/[0.08] text-slate-100/88 hover:-translate-y-px hover:border-white/28 hover:bg-white/[0.13] hover:text-white';
  } else if (variant === 'directions') {
    variantClass = 'border border-sky-300/18 bg-sky-400/8 text-sky-200/80 hover:-translate-y-px hover:border-sky-300/30 hover:bg-sky-400/14 hover:text-sky-100';
  }

  return (
    <button
      type="button"
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/45 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0f19] ${variantClass}`}
    >
      {icon}
      {label}
    </button>
  );
}

function LocationMiniIcon() {
  return (
    <svg className="h-3 w-3 shrink-0 text-brand-muted/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function ProductThumb({ icon, name }) {
  const [hasImageError, setHasImageError] = useState(false);

  if (!icon || hasImageError) {
    return (
      <div
        role="img"
        aria-label={name}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-gradient-to-br from-slate-800/85 via-slate-700/75 to-slate-800/85 text-sm font-semibold text-slate-200 shadow-inner shadow-white/5"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 6H2l2-2h16l2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6" />
        </svg>
      </div>
    );
  }

  return (
    <div className="shrink-0 rounded-xl border border-white/12 bg-white/[0.02] p-1">
      <img
        src={icon}
        alt={name}
        loading="lazy"
        onError={() => setHasImageError(true)}
        className="h-12 w-12 rounded-lg object-cover"
      />
    </div>
  );
}

export default function ProductPreview() {
  const [selected, setSelected] = useState(PRODUCTS[0].id);
  const [expanded, setExpanded] = useState(PRODUCTS[0].id);
  const [expandedBadges, setExpandedBadges] = useState({});
  const [sortBy, setSortBy] = useState('best-match');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [voiceIntentQuery, setVoiceIntentQuery] = useState('');
  const [locationLabel, setLocationLabel] = useState(DEFAULT_LOCATION_LABEL);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [hasUsedVoiceHint, setHasUsedVoiceHint] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [uploadImageToken, setUploadImageToken] = useState('');
  const sortMenuRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setIsVoiceSupported(typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

    try {
      const voiceHintSeen = window.localStorage.getItem('gotrade-voice-hint-seen') === '1';
      setHasUsedVoiceHint(voiceHintSeen);
    } catch {
      setHasUsedVoiceHint(false);
    }
  }, []);

  useEffect(() => {
    setUploadImageToken(String(Date.now()));
  }, []);

  useEffect(() => {
    let isDisposed = false;

    async function resolveLocation(position) {
      try {
        const params = new URLSearchParams({
          format: 'jsonv2',
          lat: String(position.coords.latitude),
          lon: String(position.coords.longitude),
          zoom: '14',
          addressdetails: '1',
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
          headers: {
            'Accept-Language': 'en-GB,en',
          },
        });

        if (!response.ok) {
          throw new Error('Location lookup failed');
        }

        const data = await response.json();

        if (!isDisposed) {
          setLocationLabel(formatLocationLabel(data.address));
        }
      } catch {
        if (!isDisposed) {
          setLocationLabel('Current location');
        }
      }
    }

    if (!navigator.geolocation) {
      return () => {
        isDisposed = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void resolveLocation(position);
      },
      () => {
        if (!isDisposed) {
          setLocationLabel(DEFAULT_LOCATION_LABEL);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );

    return () => {
      isDisposed = true;
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setIsSortMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const intent = parseSearchIntent(voiceIntentQuery);
    const searchTerms = parseSearchIntent(searchQuery).terms;
    const activeSortBy = intent.sortBy || sortBy;
    const filtered = PRODUCTS.filter((product) => {
      const passesStock = !(inStockOnly || intent.inStockOnly) || product.stockLevel !== 'out';
      const passesOpenNow = !(openNowOnly || intent.openNowOnly) || product.isOpenNow;
      const searchableText = getSearchableText(product);
      const passesSearch = searchTerms.length === 0 || searchTerms.every((term) => searchableText.includes(term));
      return passesStock && passesOpenNow && passesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (activeSortBy === 'cheapest') {
        return toPriceNumber(a.price) - toPriceNumber(b.price);
      }

      if (activeSortBy === 'closest') {
        return toDistanceNumber(a.distance) - toDistanceNumber(b.distance);
      }

      if (activeSortBy === 'fastest-collection') {
        return toCollectionMinutes(a.collection) - toCollectionMinutes(b.collection);
      }

      const scoreA = toPriceNumber(a.price) * 0.45 + toDistanceNumber(a.distance) * 3 + toCollectionMinutes(a.collection) * 0.8;
      const scoreB = toPriceNumber(b.price) * 0.45 + toDistanceNumber(b.distance) * 3 + toCollectionMinutes(b.collection) * 0.8;
      return scoreA - scoreB;
    });

    return sorted;
  }, [inStockOnly, openNowOnly, searchQuery, sortBy, voiceIntentQuery]);

  const searchIntent = useMemo(() => parseSearchIntent(voiceIntentQuery), [voiceIntentQuery]);
  const activeSortBy = searchIntent.sortBy || sortBy;
  const shouldShowVoiceHelper = isListening || Boolean(liveTranscript) || Boolean(voiceError) || !hasUsedVoiceHint;

  const voiceHelperText = useMemo(() => {
    if (voiceError) {
      return voiceError;
    }

    if (isListening && liveTranscript) {
      return `Hearing: ${liveTranscript}`;
    }

    if (isListening) {
      return 'Listening... try “cheap nearby makita” or “open now copper pipe”.';
    }

    if (!isVoiceSupported) {
      return 'Voice search works in supported browsers like Chrome or Edge.';
    }

    return 'Tap the mic and say something like “cheap nearby makita” or “open now copper pipe”.';
  }, [isListening, isVoiceSupported, liveTranscript, voiceError]);

  useEffect(() => {
    if (visibleProducts.length === 0) {
      setSelected('');
      setExpanded('');
      return;
    }

    if (!visibleProducts.some((product) => product.id === selected)) {
      setSelected(visibleProducts[0].id);
      setExpanded(visibleProducts[0].id);
    }
  }, [selected, visibleProducts]);

  function startVoiceSearch() {
    if (!isVoiceSupported) {
      setVoiceError('Voice search is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    if (!hasUsedVoiceHint) {
      setHasUsedVoiceHint(true);
      try {
        window.localStorage.setItem('gotrade-voice-hint-seen', '1');
      } catch {
        // Ignore localStorage errors in restricted browser contexts.
      }
    }

    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionApi();
    const previousValue = searchInputValue;
    const previousQuery = searchQuery;
    const previousVoiceIntentQuery = voiceIntentQuery;

    recognition.lang = 'en-GB';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setVoiceError('');
      setIsListening(true);
      setLiveTranscript('');
      setSearchInputValue('Listening...');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();

      if (!transcript) {
        return;
      }

      setLiveTranscript(transcript);
      setSearchInputValue(transcript);

      if (event.results[event.results.length - 1]?.isFinal) {
        setSearchQuery(transcript);
        setVoiceIntentQuery(transcript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        setVoiceError('Voice input did not complete. Try again.');
      }

      setSearchInputValue(previousValue);
      setSearchQuery(previousQuery);
      setVoiceIntentQuery(previousVoiceIntentQuery);
      setLiveTranscript('');
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      setLiveTranscript('');
      setSearchInputValue((current) => (current === 'Listening...' ? previousValue : current));
    };

    recognition.start();
  }

  const recommendationLabel = activeSortBy === 'best-match' ? 'Recommended' : 'Best option';

  return (
    <div className="preview-app relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#131c2e] to-[#0b0f19] shadow-[0_0_80px_rgba(59,130,246,0.10),0_32px_80px_rgba(0,0,0,0.55)]">

      {/* Top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />

      {/* App header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted/60">
            Product Search
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-brand-text">
            {visibleProducts.length} results
            <span className="font-normal text-brand-muted">·</span>
            <span className="flex items-center gap-1 font-normal text-brand-muted">
              <LocationMiniIcon />
              {locationLabel}
            </span>
          </p>
        </div>
        <button
          type="button"
          aria-label="Search by photo"
          className="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-brand-blue/40 bg-brand-blue/22 text-brand-blue shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_8px_18px_rgba(59,130,246,0.2)] transition-all duration-200 hover:scale-105 hover:bg-brand-blue/30 hover:text-sky-100 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.16),0_12px_24px_rgba(59,130,246,0.28)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/45 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0f19]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 2H4a2 2 0 0 0-2 2v2M18 2h2a2 2 0 0 1 2 2v2M6 22H4a2 2 0 0 1-2-2v-2M18 22h2a2 2 0 0 0 2-2v-2" />
            <rect x="8.5" y="8.5" width="7" height="7" rx="1" />
          </svg>
          <span className="pointer-events-none absolute -bottom-8 right-0 max-w-[8rem] rounded-md border border-white/14 bg-[#0d1524]/95 px-2 py-1 text-right text-[9px] font-medium leading-tight text-brand-muted/85 opacity-0 shadow-[0_8px_22px_rgba(2,8,23,0.4)] transition-opacity duration-150 group-hover:opacity-100">
            Search by photo
          </span>
          <span className="pointer-events-none absolute inset-0 rounded-full animate-[pulse_2.2s_ease-in-out_infinite] bg-brand-blue/10 opacity-60" aria-hidden="true" />
        </button>
      </div>

      {/* Search pill */}
      <div className="mx-5 mb-2 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5">
        <svg className="h-3.5 w-3.5 shrink-0 text-brand-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
        </svg>
        <span className="min-w-0 flex-1 text-xs font-medium text-brand-muted/76">{searchInputValue || DEFAULT_SEARCH_PROMPT}</span>
        <button
          type="button"
          onClick={startVoiceSearch}
          aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
          aria-pressed={isListening}
          disabled={!isVoiceSupported}
          className={`ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/45 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0f19] ${
            isListening
              ? 'animate-[voicePulse_1.8s_ease-in-out_infinite] border-brand-blue/35 bg-brand-blue/18 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.14),0_8px_18px_rgba(59,130,246,0.20)]'
              : 'border-white/10 bg-white/[0.06] text-brand-muted/75 hover:border-white/20 hover:bg-white/[0.1]'
          } ${!isVoiceSupported ? 'cursor-not-allowed opacity-45' : ''}`}
        >
          <MicIcon listening={isListening} />
        </button>
      </div>

      <div className="mx-3 mb-4 flex flex-wrap items-center justify-between gap-2 sm:mx-5">
        {shouldShowVoiceHelper && (
          <p className={`text-[9px] font-medium ${voiceError ? 'text-amber-200/72' : 'text-brand-muted/52'}`}>
            {voiceHelperText}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-[10px] text-brand-muted/58">
          {searchIntent.sortBy && (
            <span className="rounded-full border border-brand-blue/18 bg-brand-blue/10 px-2 py-0.5 text-brand-blue/85">
              Voice sort: {getSortLabel(searchIntent.sortBy)}
            </span>
          )}
          {searchIntent.openNowOnly && (
            <span className="rounded-full border border-sky-300/18 bg-sky-400/10 px-2 py-0.5 text-sky-200/85">Open now</span>
          )}
          {searchIntent.inStockOnly && (
            <span className="rounded-full border border-emerald-400/18 bg-emerald-500/10 px-2 py-0.5 text-emerald-300/85">In stock</span>
          )}
        </div>
      </div>

      {/* Filters and sorting */}
      <div className="mx-3 mb-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:mx-5 sm:p-3.5">
        <div className="flex flex-wrap items-end gap-x-2.5 gap-y-2">
          <div ref={sortMenuRef} className="relative">
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-[0.16em] text-brand-muted/60">
              Sort by
            </label>
            <button
              type="button"
              onClick={() => setIsSortMenuOpen((current) => !current)}
              className="flex h-[34px] w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-left text-[11px] font-medium text-brand-text shadow-[0_6px_14px_rgba(2,8,23,0.22)] backdrop-blur-sm transition-all duration-200 hover:border-white/22 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue/35 sm:w-[220px]"
              aria-haspopup="listbox"
              aria-expanded={isSortMenuOpen}
            >
              <span>{getSortLabel(activeSortBy)}</span>
              <svg className={`h-3.5 w-3.5 text-brand-muted/75 transition-transform duration-200 ${isSortMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isSortMenuOpen && (
              <div className="absolute left-0 z-30 mt-1.5 w-full animate-[dropdown-open_150ms_ease-out] overflow-hidden rounded-xl border border-white/10 bg-[#0d1524]/96 p-2 shadow-[0_8px_24px_rgba(2,8,23,0.38),0_2px_8px_rgba(2,8,23,0.18)] backdrop-blur-md sm:w-[220px]">
                {SORT_GROUPS.map((group, groupIndex) => (
                  <div key={group.label} className={groupIndex > 0 ? 'mt-3.5 border-t border-white/[0.04] pt-3.5' : ''}>
                    <p className="mb-0.5 px-2.5 pb-1 text-[9px] font-medium uppercase tracking-[0.15em] text-white/40">{group.label}</p>
                    <div role="listbox" aria-label={`Sort by ${group.label}`}>
                      {group.options.map((option) => {
                        const isCurrent = activeSortBy === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSortBy(option.value);
                              setVoiceIntentQuery('');
                              setIsSortMenuOpen(false);
                            }}
                            className={`flex w-full flex-col rounded-lg px-2.5 py-2 text-left transition-all duration-[150ms] border ${
                              isCurrent
                                ? (SORT_TINTS[option.value]?.selected ?? 'bg-sky-500/14 border-sky-400/28')
                                : `border-transparent ${SORT_TINTS[option.value]?.idle ?? 'hover:bg-white/[0.06]'} hover:border-white/10`
                            }`}
                          >
                            <span className={`text-[11px] font-semibold leading-snug ${
                              isCurrent ? 'text-white' : 'text-white/90'
                            }`}>{option.label}</span>
                            <span className={`mt-0.5 text-[9px] font-[450] leading-[1.35] [text-shadow:0_0_8px_rgba(255,255,255,0.04)] ${
                              isCurrent ? 'text-[rgba(200,220,255,0.8)]' : 'text-[rgba(200,220,255,0.65)]'
                            }`}>{option.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setInStockOnly((current) => !current)}
            aria-pressed={inStockOnly}
            className={`flex h-[34px] shrink-0 items-center rounded-lg border px-3 py-2 text-[11px] font-medium shadow-[0_6px_14px_rgba(2,8,23,0.22)] backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-300/45 ${
              inStockOnly
                ? 'border-emerald-400/35 bg-emerald-500/18 text-emerald-200 shadow-[0_0_0_1px_rgba(52,211,153,0.10),0_8px_18px_rgba(5,150,105,0.22)]'
                : 'border-white/10 bg-white/[0.06] text-brand-muted/78 hover:-translate-y-px hover:border-white/22 hover:bg-white/[0.1] hover:text-brand-text'
            }`}
          >
            In Stock Only
          </button>

          <button
            type="button"
            onClick={() => setOpenNowOnly((current) => !current)}
            aria-pressed={openNowOnly}
            className={`flex h-[34px] shrink-0 items-center rounded-lg border px-3 py-2 text-[11px] font-medium shadow-[0_6px_14px_rgba(2,8,23,0.22)] backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue/45 ${
              openNowOnly
                ? 'border-brand-blue/35 bg-brand-blue/18 text-sky-100 shadow-[0_0_0_1px_rgba(59,130,246,0.12),0_8px_18px_rgba(37,99,235,0.22)]'
                : 'border-white/10 bg-white/[0.06] text-brand-muted/78 hover:-translate-y-px hover:border-white/22 hover:bg-white/[0.1] hover:text-brand-text'
            }`}
          >
            Open Now
          </button>
        </div>
      </div>

      {/* Product list */}
      <div className="px-3 pb-4">
        {visibleProducts.map((p, i) => {
          const isSelected = selected === p.id;
          const isExpanded = expanded === p.id;
          const areExtraBadgesOpen = Boolean(expandedBadges[p.id]);
          const hasDivider = i < visibleProducts.length - 1;
          const stockBadge = getStockBadge(p.stockQty);

          const normalizedUrgency = p.urgency === 'Selling fast' && stockBadge.tone === 'backSoon' ? '' : p.urgency;
          const keyHighlight = p.valueTag || normalizedUrgency;
          const shouldHideSellingFast = (stockBadge.tone === 'low' || stockBadge.tone === 'backSoon') && normalizedUrgency === 'Selling fast';
          const secondaryBadgePool = [
            p.valueTag,
            normalizedUrgency && !shouldHideSellingFast && normalizedUrgency !== stockBadge.label && !/^Only\s+\d+\s+left$/i.test(normalizedUrgency) ? normalizedUrgency : '',
            p.tradePricing ? 'Trade pricing available' : '',
            p.vatInvoice ? 'VAT invoice available' : '',
          ].filter(Boolean);

          const hiddenSecondaryBadges = secondaryBadgePool.filter((label) => label !== keyHighlight);

          return (
            <div key={p.id} className={hasDivider ? 'mb-5 border-b border-white/[0.08] pb-5 sm:mb-6 sm:pb-6' : ''}>
              <article
                onClick={() => {
                  setSelected(p.id);
                  setExpanded((current) => (current === p.id ? '' : p.id));
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelected(p.id);
                    setExpanded((current) => (current === p.id ? '' : p.id));
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                className={`group relative flex cursor-pointer flex-col rounded-xl border px-4 py-4 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/45 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0f19] sm:min-h-[19rem] sm:px-5 sm:py-5 ${
                  isSelected
                    ? 'border-brand-blue/34 bg-brand-blue/[0.075] shadow-[0_6px_22px_rgba(59,130,246,0.14)]'
                    : 'border-white/[0.07] bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.06] hover:shadow-[0_8px_24px_rgba(0,0,0,0.42)]'
                }`}
              >
                {i === 0 && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-violet-300/24 bg-violet-300/12 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-violet-100/95">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="m10 2.5 2.13 4.32 4.77.69-3.45 3.36.82 4.75L10 13.38l-4.27 2.24.82-4.75L3.1 7.51l4.77-.69L10 2.5z" />
                    </svg>
                    {recommendationLabel}
                  </span>
                )}

                <div className="flex flex-1 flex-col">
                  {/* Row 1: name + selected badge */}
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[1.125rem]">
                    <ProductThumb
                      icon={
                        p.id === 'impact-driver'
                          ? `/drill.png?t=${uploadImageToken || '0'}`
                          : p.id === 'copper-pipe'
                            ? `/api/latest-upload-image?t=${uploadImageToken || '0'}`
                            : p.id === 'led-downlight'
                              ? `/downlight.png?t=${uploadImageToken || '0'}`
                            : p.image
                      }
                      name={p.name}
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`flex items-start justify-between gap-2 ${i === 0 ? 'pr-16' : 'pr-1'}`}>
                        <p className="min-h-[2.5rem] flex-1 overflow-hidden pr-1 text-sm font-semibold leading-snug text-brand-text">{p.name}</p>
                      </div>

                      <p className="mt-1 min-h-[1.5rem] overflow-hidden text-[11px] leading-snug text-brand-muted/60">{p.specs}</p>

                      {/* Row 2: store · area · distance · drive time · rating */}
                      <p className="mt-2.5 flex flex-wrap items-center gap-y-1 text-[11px] leading-none text-brand-muted/60">
                        <span className="font-medium text-brand-muted/80">{p.store}</span>
                        <span className="mx-1.5 opacity-30">·</span>
                        <span className="inline-flex items-center gap-1">
                          <LocationMiniIcon />
                          {p.area}
                        </span>
                        <span className="mx-1.5 opacity-30">·</span>
                        {p.distance}
                        <span className="mx-1.5 opacity-30">·</span>
                        {p.driveTime}
                        <span className="mx-1.5 opacity-30">·</span>
                        {p.rating}
                      </p>

                      <p className={`mt-1.5 text-[10px] font-medium ${p.isOpenNow ? 'text-emerald-300/90' : 'text-yellow-300/90'}`}>
                        {p.storeStatus}
                      </p>
                    </div>
                  </div>

                  {/* Row 3: badges */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:mt-4">
                    <span className="rounded-full border border-white/24 bg-white/[0.08] px-2.5 py-[3px] text-[10px] font-semibold text-white/90">
                      {p.price}
                    </span>
                    <span className={`rounded-full px-2.5 py-[3px] text-[10px] font-medium ${STOCK_STYLES[stockBadge.tone]}`}>
                      {stockBadge.label}
                    </span>
                    <span className="rounded-full border border-brand-blue/20 bg-brand-blue/10 px-2.5 py-[3px] text-[10px] text-[#bfdbfe]">
                      {p.collection}
                    </span>
                    {keyHighlight && (
                      <span className={`rounded-full px-2.5 py-[3px] text-[10px] font-medium ${getSecondaryBadgeClass(keyHighlight)}`}>
                        {keyHighlight}
                      </span>
                    )}

                    {hiddenSecondaryBadges.length > 0 && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setExpandedBadges((current) => ({
                            ...current,
                            [p.id]: !current[p.id],
                          }));
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.015] px-2 py-[2px] text-[9px] font-medium text-brand-muted/50 transition-all duration-200 hover:border-white/18 hover:bg-white/[0.04] hover:text-brand-muted/75"
                        aria-expanded={areExtraBadgesOpen}
                      >
                        {areExtraBadgesOpen ? 'Hide ▲' : `+${hiddenSecondaryBadges.length} more ▼`}
                      </button>
                    )}
                  </div>

                  {hiddenSecondaryBadges.length > 0 && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        areExtraBadgesOpen ? 'mt-2.5 max-h-20 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                      aria-hidden={!areExtraBadgesOpen}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {hiddenSecondaryBadges.map((badge) => (
                          <span key={`${p.id}-${badge}`} className={`rounded-full px-2.5 py-[3px] text-[10px] font-medium ${getSecondaryBadgeClass(badge)}`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="mt-2.5 rounded-lg border border-white/8 bg-white/[0.02] p-2.5 text-[10px] text-brand-muted/70">
                      {p.vatInvoice && <p className="mt-1">VAT invoice available at checkout.</p>}
                      {p.alternative && <p className="mt-1 text-brand-muted/65">{p.alternative}</p>}
                      <p className="mt-1.5 text-brand-muted/60">Tap View for collection instructions and route details.</p>
                    </div>
                  )}
                </div>

                {/* Row 4: action buttons — always visible for accessibility and mobile usability */}
                <div className="mt-auto overflow-visible pt-5 opacity-100">
                  <div className="flex items-center gap-2 border-t border-white/[0.07] pt-3 opacity-95 transition-all duration-200 hover:-translate-y-px hover:opacity-100">
                    <ActionBtn icon={<EyeIcon />} label="View" variant="view" />
                    <ActionBtn icon={<BookmarkIcon />} label="Reserve" variant="primary" />
                    <ActionBtn icon={<MapPinIcon />} label="Directions" variant="directions" />
                  </div>
                </div>
              </article>
            </div>
          );
        })}

        {visibleProducts.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-xs text-brand-muted/75">
            No products match that search. Try a different phrase or turn off Open Now or In Stock Only.
          </div>
        )}
      </div>
    </div>
  );
}
