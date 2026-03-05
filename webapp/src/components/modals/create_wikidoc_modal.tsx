import React, {ComponentProps, useState} from 'react';

import {useIntl} from 'react-intl';

import styled from 'styled-components';
import MDEditor, {commands} from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

import '@uiw/react-md-editor/markdown-editor.css';

import GenericModal, {InlineLabel} from '../widgets/generic_modal';
import useEditorColorMode from '../../hooks/useEditorColorMode';

const ID = 'wikiDoc_create';

export const makeWikiDocCreateModal = (props: WikiDocCreateModalProps) => ({
    modalId: ID,
    dialogType: WikiDocCreateModal,
    dialogProps: props,
});

export type WikiDocCreateModalProps = {
    createFunc: (name: string, description: string, status: string, content: string) => Promise<void>
} & Partial<ComponentProps<typeof GenericModal>>;

const BaseInput = styled.input`
    color: rgb(var(--center-channel-color-rgb));
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    background-color: rgb(var(--center-channel-bg-rgb));
    border: none;
    box-shadow: inset 0 0 0 1px rgba(var(--center-channel-color-rgb), 0.16);
    border-radius: 4px;
    min-height: 40px;
    line-height: 40px;
    padding: 0 16px;
    font-size: 14px;

    &:focus {
        box-shadow: inset 0 0 0 2px var(--button-bg);
    }
`;

const SizedGenericModal = styled(GenericModal)`
    width: calc(80vw);
    max-width: 1200px;
    @media (max-width: 800px) {
      width: calc(95vw);
    }
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;

    & > div, & > input {
        margin-bottom: 24px;
    }
`;

const EditorWrapper = styled.div`
    .w-md-editor {
        border-radius: 4px;
        box-shadow: inset 0 0 0 1px rgba(var(--center-channel-color-rgb), 0.16);
        background-color: rgb(var(--center-channel-bg-rgb));
        color: rgb(var(--center-channel-color-rgb));
    }

    .w-md-editor-toolbar {
        background-color: rgba(var(--center-channel-color-rgb), 0.04);
        border-bottom: 1px solid rgba(var(--center-channel-color-rgb), 0.12);
        border-radius: 4px 4px 0 0;
    }

    .w-md-editor-toolbar li > button {
        color: rgba(var(--center-channel-color-rgb), 0.72);
    }

    .w-md-editor-toolbar li > button:hover {
        color: rgb(var(--center-channel-color-rgb));
        background-color: rgba(var(--center-channel-color-rgb), 0.08);
    }

    .w-md-editor-text-input,
    .w-md-editor-text {
        color: rgb(var(--center-channel-color-rgb)) !important;
        -webkit-text-fill-color: rgb(var(--center-channel-color-rgb)) !important;
        caret-color: rgb(var(--center-channel-color-rgb));
        background-color: rgb(var(--center-channel-bg-rgb));
        font-size: 14px;
        line-height: 1.6;
    }

    .wmde-markdown {
        background-color: rgb(var(--center-channel-bg-rgb));
        color: rgb(var(--center-channel-color-rgb));
        font-size: 14px;
    }
`;

const WikiDocCreateModal = ({createFunc, ...modalProps}: WikiDocCreateModalProps) => {
    const {formatMessage} = useIntl();
    const [name, setName] = useState('');
    const [description] = useState('');
    const [status] = useState('');
    const [content, setContent] = useState('');
    const colorMode = useEditorColorMode();

    const requirementsMet = (name !== '');

    return (
        <SizedGenericModal
            id={ID}
            modalHeaderText={formatMessage({defaultMessage: 'Create Wiki Page'})}
            {...modalProps}
            confirmButtonText={formatMessage({defaultMessage: 'Create'})}
            cancelButtonText={formatMessage({defaultMessage: 'Cancel'})}
            isConfirmDisabled={!requirementsMet}
            handleConfirm={() => createFunc(name, description, status, content)}
            showCancel={true}
            autoCloseOnCancelButton={true}
            autoCloseOnConfirmButton={true}
        >
            <Body>
                <InlineLabel>{formatMessage({defaultMessage: 'Page title'})}</InlineLabel>
                <BaseInput
                    autoFocus={true}
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={formatMessage({defaultMessage: 'Give your page a title'})}
                />
                <InlineLabel>{formatMessage({defaultMessage: 'Content'})}</InlineLabel>
                <EditorWrapper data-color-mode={colorMode}>
                    <MDEditor
                        value={content}
                        onChange={(val) => setContent(val ?? '')}
                        preview='live'
                        height={400}
                        previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                        }}
                        commands={[
                            commands.bold,
                            commands.italic,
                            commands.strikethrough,
                            commands.hr,
                            commands.divider,
                            commands.title1,
                            commands.title2,
                            commands.title3,
                            commands.divider,
                            commands.link,
                            commands.quote,
                            commands.code,
                            commands.codeBlock,
                            commands.divider,
                            commands.unorderedListCommand,
                            commands.orderedListCommand,
                            commands.checkedListCommand,
                            commands.divider,
                            commands.table,
                        ]}
                        extraCommands={[
                            commands.codeEdit,
                            commands.codeLive,
                            commands.codePreview,
                        ]}
                    />
                </EditorWrapper>
            </Body>
        </SizedGenericModal>
    );
};

export default WikiDocCreateModal;
