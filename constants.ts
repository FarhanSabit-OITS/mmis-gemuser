
import { Role, CityMarketData, Market } from './types';

export const ROLES_HIERARCHY: Record<Role, Role[]> = {
  SUPER_ADMIN: ['MARKET_ADMIN', 'COUNTER_STAFF', 'VENDOR', 'SUPPLIER', 'USER'],
  MARKET_ADMIN: ['COUNTER_STAFF', 'VENDOR', 'USER'],
  COUNTER_STAFF: ['USER'],
  VENDOR: ['USER'],
  SUPPLIER: ['USER'],
  USER: [],
};

export const CITIES_AND_MARKETS: CityMarketData[] = [
  { city: 'Mbarara', markets: ['Mbarara Central', 'Rwebikoona', 'Nyamityobora'] },
  { city: 'Kabale', markets: ['Kabale Central', 'Bugongi', 'Mwanjari'] },
  { city: 'Jinja', markets: ['Jinja Main', 'Amber Court', 'Napier Market'] },
  { city: 'Kampala', markets: ['Owino', 'Nakasero', 'Kalerwe', 'Wandegeya'] },
  { city: 'Gulu', markets: ['Gulu Main', 'Cergia'] },
];

export const MOCK_MARKETS: Market[] = [
  { 
    id: 'M-001', 
    name: 'Owino Market', 
    city: 'Kampala', 
    type: 'WHOLESALE', 
    ownership: 'PUBLIC', 
    establishedDate: '1971-04-12', 
    primaryProducts: ['Apparel', 'Textiles', 'Footwear'], 
    capacity: 50000 
  },
  { 
    id: 'M-002', 
    name: 'Nakasero Market', 
    city: 'Kampala', 
    type: 'RETAIL', 
    ownership: 'PPP', 
    establishedDate: '1895-10-05', 
    primaryProducts: ['Produce', 'Groceries', 'Fruits'], 
    capacity: 15000 
  },
  { 
    id: 'M-003', 
    name: 'Mbarara Central', 
    city: 'Mbarara', 
    type: 'MIXED', 
    ownership: 'PUBLIC', 
    establishedDate: '1982-06-20', 
    primaryProducts: ['Electronics', 'Cereals', 'Livestock'], 
    capacity: 12000 
  }
];

export const STORE_LEVELS = ['Ground Floor', 'Level 1', 'Level 2', 'Level 3', 'Basement', 'Roof Top'];
export const STORE_SECTIONS = ['Aisle A', 'Aisle B', 'Clothing Wing', 'Fresh Produce Area', 'Electronics Hub', 'Food Court'];
