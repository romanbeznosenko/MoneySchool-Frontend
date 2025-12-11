import apiClient from './clientApi'

/**
 * Finance API endpoints
 */
export const financeApi = {
    /**
     * Get the current user's finance account
     * @returns {Promise<FinanceAccountResponse>}
     */
    getFinanceAccount: async () => {
        const response = await apiClient.get('/api/finance-account/');
        return response.data;
    },

    /**
     * Get user collections
     * @param {Object} params
     * @param {number} params.limit
     * @param {number} params.page
     * @param {boolean} params.isTreasurer
     * @returns {Promise<CollectionsResponse>}
     */
    getCollections: async ({ limit = 10, page = 1, isTreasurer = false } = {}) => {
        const response = await apiClient.get('/api/collection/list', {
            params: { limit, page, isTreasurer },
        });
        return response.data;
    },

    getMyContributions: async ({ collectionId, page = 0, limit = 20 } = {}) => {
        const response = await apiClient.get('/api/contribution/my-contributions', {
            params: { collectionId, page, limit },
        });
        return response.data;
    }
};
