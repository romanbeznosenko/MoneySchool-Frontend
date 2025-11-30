export class UserResponseDto {
    constructor(data) {
        this.id = data?.id || null;
        this.email = data?.email || '';
        this.name = data?.name || '';
        this.surname = data?.surname || '';
        // Normalize avatar URL: if backend returns a relative path, prefix with base URL from env
        const rawAvatar = data?.avatar || '';
        if (rawAvatar && !rawAvatar.startsWith('http')) {
            const base = import.meta.env.VITE_API_BASE_URL || '';
            const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
            // ensure leading slash on relative path
            const path = rawAvatar.startsWith('/') ? rawAvatar : `/${rawAvatar}`;
            this.avatar = normalizedBase ? `${normalizedBase}${path}` : path;
        } else {
            this.avatar = rawAvatar;
        }
    }
}