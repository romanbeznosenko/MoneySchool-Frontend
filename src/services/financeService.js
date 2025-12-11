import { financeApi } from '../services/api/financeApi';
import { ErrorResponseDto } from '../dto/ErrorResponse';

/**
 * DTO for finance account
 */
export class FinanceAccountDto {
    constructor({ id, IBAN, balance, isTreasurerAccount }) { // notice IBAN here
        this.id = id;
        this.iban = IBAN; // map to lowercase for consistency in your app
        this.balance = balance;
        this.isTreasurerAccount = isTreasurerAccount;
    }
}


/**
 * Finance service for handling finance account API calls
 */
export const financeService = {
    /**
     * Fetch the current user's finance account
     * @returns {Promise<FinanceAccountDto>}
     */
    getFinanceAccount: async () => {
        try {
            const apiResponse = await financeApi.getFinanceAccount();
            if (!apiResponse.data) {
                throw new Error('No finance account data returned from API');
            }

            const financeAccountDto = new FinanceAccountDto(apiResponse.data);

            console.log('Finance account retrieved successfully:', financeAccountDto);
            return financeAccountDto;
        } catch (error) {
            console.error('Finance account service error:', error);
            throw new ErrorResponseDto(
                error.message || 'Failed to retrieve finance account.',
                error.httpStatus
            );
        }
    },
};
