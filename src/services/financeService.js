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

export class CollectionDto {
    constructor({
        collectionId,
        title,
        description,
        goal,
        logo,
        status,
        aClass,
        financeAccount,
        totalCollected,
        remainingAmount,
        perStudentGoal,
        totalStudentsCount,
        studentsPaidInFullCount,
        goalReachedAt,
    }) {
        this.id = collectionId;
        this.title = title;
        this.description = description;
        this.goal = goal;
        this.logo = logo;
        this.status = status;
        this.class = aClass;
        this.financeAccount = financeAccount;
        this.totalCollected = totalCollected;
        this.remainingAmount = remainingAmount;
        this.perStudentGoal = perStudentGoal;
        this.totalStudentsCount = totalStudentsCount;
        this.studentsPaidInFullCount = studentsPaidInFullCount;
        this.goalReachedAt = goalReachedAt;
    }
}

export class TransactionDto {
    constructor({
        contributionId,
        collection,
        student,
        payer,
        amount,
        note,
        status,
        createdAt,
        processedAt,
    }) {
        this.id = contributionId;
        this.collection = collection;
        this.student = student;
        this.payer = payer;
        this.amount = amount;
        this.note = note;
        this.status = status;
        this.createdAt = createdAt;
        this.processedAt = processedAt;
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

    getCollections: async ({ limit = 10, page = 1, isTreasurer = false } = {}) => {
        try {
            const apiResponse = await financeApi.getCollections({ limit, page, isTreasurer });

            if (!apiResponse.data?.data) {
                throw new Error('No collections data returned from API');
            }

            // Map to DTOs
            return apiResponse.data.data.map(item => new CollectionDto(item));
        } catch (error) {
            console.error('Collections service error:', error);
            throw new Error(error.message || 'Failed to fetch collections');
        }
    },

    /**
     * Fetch user's contribution history
     * @param {Object} params
     * @param {string} params.collectionId - optional collection filter
     * @param {number} params.page
     * @param {number} params.limit
     * @returns {Promise<TransactionDto[]>}
     */
    getMyContributions: async ({ collectionId, page = 0, limit = 20 } = {}) => {
        try {
            const response = await financeApi.getMyContributions({ collectionId, page, limit });

            if (!response.data?.data) {
                throw new Error('No contributions data returned from API');
            }

            // Map each contribution to TransactionDto
            return response.data.data.map(item => new TransactionDto(item));
        } catch (error) {
            console.error('Transactions service error:', error);
            throw new Error(error.message || 'Failed to fetch contributions');
        }
    },
};
