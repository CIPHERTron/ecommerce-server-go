import { useEffect, useState } from "react"
import {
	TextField,
	Grid,
	Card,
	CardContent,
	Typography,
	Button,
} from "@material-ui/core"
import { Send } from "@material-ui/icons"
import { makeStyles } from "@material-ui/core/styles"
import Pusher from "pusher-js"

import Nav from "./Nav"

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
	},
	message: {
		marginTop: "14px",
		marginBottom: "7px",
	},
}))

function App() {
	const [username, setUsername] = useState("")
	const [messages, setMessages] = useState([])
	const [message, setMessage] = useState("")
	let allMessages = []

	useEffect(() => {
		Pusher.logToConsole = true

		const pusher = new Pusher("", {
			cluster: "",
		})

		const channel = pusher.subscribe("chat")
		channel.bind("message", function (data) {
			allMessages.push(data)
			setMessages(allMessages)
		})
	}, [allMessages])

	const submit = async (e) => {
		e.preventDefault()

		await fetch("http://localhost:7000/api/messages", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username,
				message,
			}),
		})

		setMessage("")
	}

	const classes = useStyles()

	return (
		<Nav>
			<Grid container spacing={4}>
				<Grid item xs={4}>
					<TextField
						label='Username'
						value={username}
						onChange={(e) =>
							setUsername(
								e
									.target
									.value
							)
						}
					/>
				</Grid>
				<Grid item xs={4}>
					<TextField
						label='Message'
						value={message}
						onChange={(e) =>
							setMessage(
								e
									.target
									.value
							)
						}
					/>
				</Grid>
				<Grid item xs={4}>
					<Button
						variant='contained'
						color='primary'
						className={
							classes.button
						}
						endIcon={<Send />}
						type='submit'
						onClick={submit}
					>
						Send
					</Button>
				</Grid>
			</Grid>

			{messages.map((message) => {
				return (
					<Card
						className={
							classes.message
						}
					>
						<CardContent>
							<Typography color='textPrimary'>
								Word
								of
								the
								Day
								-
								Message
							</Typography>
						</CardContent>
					</Card>
				)
			})}
		</Nav>
	)
}

export default App
