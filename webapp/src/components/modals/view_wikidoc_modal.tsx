import React, {ComponentProps, useEffect, useState} from 'react';

import {useIntl} from 'react-intl';

import styled from 'styled-components';
import MDEditor, {commands} from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

import '@uiw/react-md-editor/markdown-editor.css';

import GenericModal, {InlineLabel} from '../widgets/generic_modal';
import {WikiDoc} from '../../types/wikiDoc';

const ID = 'wikiDoc_update';

export const makeWikiDocViewModal = (props: WikiDocViewModalProps) => ({
    modalId: ID,
    dialogType: WikiDocViewModal,
    dialogProps: props,
});

export type WikiDocViewModalProps = {
    updateFunc: (id: string, name: string, content: string) => Promise<void>;
    canEdit: boolean;
    wikiDoc: WikiDoc;
} & Partial<ComponentProps<typeof GenericModal>>;

const BaseInput = styled.input`
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    background-color: rgb(var(--center-channel-bg-rgb));
    border: none;
    box-shadow: inset 0 0 0 1px rgba(var(--center-channel-color-rgb), 0.16);
    border-radius: 4px;
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

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;

    & > div, & > input {
        margin-bottom: 24px;
    }
`;

const EditorWrapper = styled.div<{$viewOnly: boolean}>`
    .w-md-editor-text-input {
        color: rgb(var(--center-channel-color-rgb)) !important;
        -webkit-text-fill-color: rgb(var(--center-channel-color-rgb)) !important;
        caret-color: rgb(var(--center-channel-color-rgb));
    }

    .w-md-editor {
        border-radius: 4px;
        box-shadow: ${({$viewOnly}) => ($viewOnly ? 'none' : 'inset 0 0 0 1px rgba(var(--center-channel-color-rgb), 0.16)')};
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
        color: rgb(var(--center-channel-color-rgb));
        background-color: rgb(var(--center-channel-bg-rgb));
        font-size: 14px;
        line-height: 1.6;
    }

    .wmde-markdown {
        background-color: rgb(var(--center-channel-bg-rgb));
        color: rgb(var(--center-channel-color-rgb));
        font-size: 14px;
        padding: ${({$viewOnly}) => ($viewOnly ? '0' : '16px')};
    }
`;

const WikiDocViewModal = ({updateFunc, canEdit, wikiDoc, ...modalProps}: WikiDocViewModalProps) => {
    const {formatMessage} = useIntl();
    const [wiki, setWiki] = useState(wikiDoc);
    const [name, setName] = useState(wikiDoc.name);
    const [content, setContent] = useState(wikiDoc.content);
    const [inEditMode, setInEditMode] = useState(false);

    const update = async (id: string, wikiName: string, wikiContent: string) => {
        await updateFunc(id, wikiName, wikiContent);
        setWiki({
            id,
            name: wikiName,
            content: wikiContent,
        });
        toggleEdit();
    };

    const requirementsMet = (name !== '');

    const toggleEdit = () => (canEdit ? setInEditMode((prev) => !prev) : undefined);

    useEffect(() => {
        if (!inEditMode) {
            setName(wiki.name);
            setContent(wiki.content);
        }
    }, [inEditMode]);

    const ExtraHeaderButton = (
        <button
            type='button'
            className='close'
            style={{right: '45px'}}
            disabled={!canEdit}
            onClick={toggleEdit}
            title={formatMessage({defaultMessage: 'Edit page'})}
        >
            <span className='icon-pencil-outline icon-16' />
        </button>
    );

    const headerText = (
        <HeaderContainer>
            <InlineLabel>{formatMessage({defaultMessage: 'Page title'})}</InlineLabel>
            <BaseInput
                autoFocus={inEditMode}
                disabled={!inEditMode}
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </HeaderContainer>
    );

    return (
        <SizedGenericModal
            id={ID}
            components={{ExtraHeaderButton}}
            modalHeaderText={headerText}
            {...modalProps}
            confirmButtonText={formatMessage({defaultMessage: 'Save'})}
            cancelButtonText={formatMessage({defaultMessage: 'Cancel'})}
            isConfirmDisabled={!requirementsMet}
            handleConfirm={() => update(wikiDoc.id, name, content)}
            handleCancel={toggleEdit}
            showCancel={true}
            autoCloseOnCancelButton={false}
            autoCloseOnConfirmButton={false}
            hideFooter={!inEditMode}
        >
            <Container>
                <EditorWrapper $viewOnly={!inEditMode}>
                    <MDEditor
                        value={content}
                        onChange={(val) => setContent(val ?? '')}
                        preview={inEditMode ? 'live' : 'preview'}
                        hideToolbar={!inEditMode}
                        height={500}
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
            </Container>
        </SizedGenericModal>
    );
};

export default WikiDocViewModal;
