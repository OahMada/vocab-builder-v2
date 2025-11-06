'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, TextUIPart } from 'ai';

import { QUERIES, SCROLL_CONTAINER_BOTTOM_PADDING } from '@/constants';
import { handleError } from '@/utils';
import { getPrefersReducedMotion } from '@/helpers';

import Modal from '@/components/Modal';
import BottomRightSpinner from '@/components/BottomRightSpinner';
import ClientMarkdown from '@/components/ClientMarkdown';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import QuestionInput from './QuestionInput';

interface AskAQuestionProps {
	isShowing: boolean;
	onDismiss: () => void;
	sentence: string;
}

function AskAQuestion({ isShowing, onDismiss, sentence }: AskAQuestionProps) {
	let [copied, setCopied] = React.useState(false);
	let containerRef = React.useRef<null | HTMLDivElement>(null);
	let [previousScrollHeight, setPreviousScrollHeight] = React.useState(0);
	let [bottomPadding, setBottomPadding] = React.useState(SCROLL_CONTAINER_BOTTOM_PADDING);
	let [shouldScroll, setShouldScroll] = React.useState(false);

	let { messages, sendMessage, status, stop, error, regenerate } = useChat({
		transport: new DefaultChatTransport({
			api: '/api/ask-anything',
			body: {
				sentence,
			},
		}),
		experimental_throttle: 5,
	});

	let isStreaming = status === 'streaming' || status === 'submitted';
	function triggerChat(text: string) {
		if (containerRef.current) {
			setPreviousScrollHeight(containerRef.current.scrollHeight);
			setBottomPadding(SCROLL_CONTAINER_BOTTOM_PADDING);
			setShouldScroll(true);
		}
		sendMessage({
			text,
		});
	}

	function stopStreaming() {
		if (status === 'submitted' || status === 'streaming') {
			stop();
		}
	}

	function regenerateResponse() {
		if (status === 'ready') {
			regenerate();
		}
	}

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		window.setTimeout(() => {
			setCopied(false);
		}, 1000);
	}

	React.useEffect(() => {
		if (!containerRef.current) return;
		let element = containerRef.current;
		// set the padding
		element.style.paddingBottom = `${bottomPadding}px`;
		// scroll to beyond bottom
		if (shouldScroll) {
			let prefersReducedMotion = getPrefersReducedMotion();
			element.scrollTo({
				top: element.scrollHeight + bottomPadding - element.clientHeight,
				behavior: prefersReducedMotion ? 'auto' : 'smooth',
			});
			setShouldScroll(false);
		}
	}, [bottomPadding, shouldScroll]);

	React.useEffect(() => {
		if (!containerRef.current) return;
		let element = containerRef.current;

		if (status === 'ready' && !shouldScroll) {
			if (element.scrollHeight - SCROLL_CONTAINER_BOTTOM_PADDING >= previousScrollHeight + SCROLL_CONTAINER_BOTTOM_PADDING) {
				// if the filled in content takes up space bigger than bottomPadding
				setBottomPadding(0);
			} else {
				// trim off the excessive padding
				let newPadding = SCROLL_CONTAINER_BOTTOM_PADDING - (element.scrollHeight - (element.scrollTop + element.clientHeight));
				setBottomPadding(newPadding);
			}
		}
	}, [previousScrollHeight, shouldScroll, status]);

	if (!isShowing) {
		return null;
	}

	return (
		<React.Suspense fallback={<BottomRightSpinner description='loading modal component' />}>
			<Modal
				isOpen={isShowing}
				onDismiss={onDismiss}
				heading={<Title>Ask Anything</Title>}
				isOverlayTransparent={true}
				contentPosition='bottom'
				style={{ '--gap': '20px' } as React.CSSProperties}
			>
				<Sentence>{sentence}</Sentence>
				<AnswerBoxWrapper>
					<AnswerBox style={{ '--icon-size': '18px' } as React.CSSProperties} ref={containerRef}>
						<p>What questions do you have about this sentence?</p>
						{messages.map((message) => {
							if (message.role === 'user') {
								return (
									<UserInput key={message.id}>
										{message.parts
											.filter((part) => part.type === 'text')
											.map((part) => part.text)
											.join('')}
									</UserInput>
								);
							} else if (message.role === 'assistant') {
								let answer = message.parts
									.filter((part) => part.type === 'text')
									.map((part) => part.text)
									.join('');
								return (
									<React.Fragment key={message.id}>
										<ResponseWrapper>
											<React.Suspense fallback={answer}>
												<ClientMarkdown>{answer}</ClientMarkdown>
											</React.Suspense>
										</ResponseWrapper>
										{(message.parts[1] as TextUIPart).state === 'done' && (
											<Buttons>
												<CopyButton variant='icon' onClick={async () => copyToClipboard(answer)}>
													{copied ? <Icon id='accept' size={16} strokeWidth={2} /> : <Icon id='copy' size={16} strokeWidth={2} />}
													<VisuallyHidden>copy response</VisuallyHidden>
												</CopyButton>
												<RegenerateButton variant='icon' onClick={regenerateResponse}>
													<Icon id='retry' size={16} strokeWidth={2} />
													<VisuallyHidden>regenerate response</VisuallyHidden>
												</RegenerateButton>
											</Buttons>
										)}
									</React.Fragment>
								);
							}
						})}
						{error && <ErrorText>{handleError(error)}</ErrorText>}
					</AnswerBox>
				</AnswerBoxWrapper>
				<QuestionInput triggerChat={triggerChat} isStreaming={isStreaming} stopStreaming={stopStreaming} />
			</Modal>
		</React.Suspense>
	);
}

export default AskAQuestion;

var Title = styled.h2`
	font-size: 1.5rem;
	font-weight: 450;
	line-height: 1;
	transform: translateX(6px);
`;

var Sentence = styled.p`
	display: flex;
	flex-direction: column;
	gap: 5px;
	font-style: italic;
	border-left: 4px solid var(--border);
	padding-left: 0.75rem;
	font-size: 0.875rem;
`;

var AnswerBoxWrapper = styled.div`
	flex: 1;
	background-color: var(--bg-secondary);
	border-radius: 16px;
	width: 100%;
	overflow: hidden;
`;

var AnswerBox = styled.div`
	padding: 16px;
	padding-right: 10px;
	height: 100%;
	overflow: auto;
	scrollbar-gutter: stable;

	@media ${QUERIES.laptopAndUp} {
		// to compensate for the scroll gutter
		padding-right: 6px;
	}

	& > * {
		margin-bottom: 10px;
	}
`;

var ResponseWrapper = styled.div`
	// for the markdown elements
	& * {
		margin-bottom: 10px;
	}
`;

var ErrorText = styled.span`
	color: var(--text-status-warning);
`;

var UserInput = styled.p`
	background-color: var(--bg-tertiary);
	border-radius: 16px;
	max-width: 60%;
	padding: 8px 10px;
	margin-left: auto;
	width: max-content;
	white-space: pre-wrap;
`;

var Buttons = styled.div`
	display: flex;
	gap: 3px;
`;
var CopyButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	color: var(--text-secondary);
`;
var RegenerateButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	color: var(--text-secondary);
`;
