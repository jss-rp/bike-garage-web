'use client';

import { Box, Button, Grid, TextField } from "@mui/material"
import { useRouter } from "next/navigation";


const API_ENDPOINT = process.env.API_ENDPOINT

export default async function Login() {
	const router = useRouter()
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const data = new FormData(event.currentTarget)
		const credentials = {
			username: data.get('username'),
			password: data.get('password')
		}

		const headers = new Headers({ "Content-Type": "application/json" })
		const response = await fetch(
			`${API_ENDPOINT}/oauth/authorize`,
			{
				method: 'POST',
				headers,
				body: JSON.stringify(credentials)
			}
		)

		if (!response.ok) {
			throw new Error("Failed to authorize")
		}

		const result = await response.json()

		localStorage.setItem('access_token', result.data.accessToken)
		router.push('/products')
	}

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="100vh">
			<Box noValidate component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
				<TextField
					fullWidth
					required
					autoFocus
					id="username"
					name="username"
					label="Username"
					margin="normal"
				/>
				<TextField
					fullWidth
					required
					id="password"
					name="password"
					label="Password"
					type="password"
					margin="normal"
					autoComplete="current-password"
				/>
				<Button
					fullWidth
					type="submit"
					variant="contained"
					sx={{ mt: 3, mb: 2 }}>
					Sign In
				</Button>
			</Box>
		</Box>
	)
}
