'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const host = 'http://localhost:3333';

export default function ProtectedPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            router.push('/');
            return;
        }

        const validateToken = async () => {
            try {
                await axios.get(`${host}/auth/validate-token`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLoading(false);
            } catch (error: any) {
                console.error('Token inválido:', error);
                router.push('/');
            }
        };

        validateToken();
    }, [router]);

    if (loading) return <p>Validando token...</p>;

    return;
}
