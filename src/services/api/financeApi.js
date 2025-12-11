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
    }
};
