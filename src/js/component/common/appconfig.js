export const APP_NAME = 'SM App'

/* Menu configurations starts */

export const MENU_MAPPING = {
    Loan: 'Loan',
    LoanTxn: 'LoanTxn',
    Vehicle: 'Vehicle',
    VehicleTxn: 'VehicleTxn',
    Revenue: 'Revenue',
    Onetime: 'Onetime'
};


export const MENU_CONFIG = [
    {
        title: 'Manage loan', iconClass: 'fa fa-briefcase', path: '/loan',
        isRoot: true, componentName: MENU_MAPPING.Loan
    },
    {
        title: 'Manage loan transaction', iconClass: 'fa fa-exchange',
        path: '/loantxn', componentName: MENU_MAPPING.LoanTxn
    },
    {
        title: 'Manage vehicle', iconClass: 'fa fa-truck',
        path: '/vehicle', componentName: MENU_MAPPING.Vehicle
    },
    {
        title: 'Manage vehicle transaction', iconClass: 'fa fa-money',
        path: '/vehicletxn', componentName: MENU_MAPPING.VehicleTxn
    },
    {
        title: 'Revenue', iconClass: 'fa fa-bar-chart',
        path: '/revenue', componentName: MENU_MAPPING.Revenue
    },
    {
        title: 'Onetime', iconClass: 'fa fa-cog',
        path: '/onetime', componentName: MENU_MAPPING.Onetime
    }
];

/* Menu configurations ends */

export const PAGINATION_CONFIG = {
    page: 1,  // which page you want to show as default        
    sizePerPage: 10,  // which size per page you want to locate as default
    pageStartIndex: 1, // where to start counting the pages
    paginationSize: 5,  // the pagination bar size.
    prePage: 'Prev', // Previous page button text
    nextPage: 'Next', // Next page button text
    firstPage: 'First', // First page button text
    lastPage: 'Last', // Last page button text
    paginationShowsTotal: false,  // Accept bool or function
    paginationPosition: 'bottom',  // default is bottom, top and both is all available
    hideSizePerPage: true // You can hide the dropdown for sizePerPage
    // alwaysShowAllBtns: true // Always show next and previous button
    // withFirstAndLast: false > Hide the going to First and Last page button
};

export const MODAL_STYLE_CONFIG = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        height: '500px'
    },
    overlay: {
        backgroundColor: 'rgb(0, 0, 0, 0.7)'
    }
};