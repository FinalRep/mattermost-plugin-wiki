import React, {ComponentProps, useEffect, useState} from 'react';

import {useIntl} from 'react-intl';

import styled from 'styled-components';

import MarkdownTextbox from '../markdown/markdown_textbox';
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
      .width: calc(80vw);
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

    const toggleEdit = () => (canEdit ? setInEditMode(!inEditMode) : '');

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
        >
            <span className='icon-pencil-outline icon-16' />
        </button>);

    const headerText = (
        <HeaderContainer>
            <InlineLabel>{formatMessage({defaultMessage: 'Wiki name'})}</InlineLabel>
            <BaseInput
                autoFocus={true}
                disabled={!inEditMode}
                type={'text'}
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
            confirmButtonText={formatMessage({defaultMessage: 'Update'})}
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
                <MarkdownTextbox
                    value={content}
                    disabled={!inEditMode}
                    setValue={setContent}
                    inPreview={!inEditMode}
                    placeholder={formatMessage({defaultMessage: 'You can add the content of the doc here or edit it later'})}
                />
            </Container>
        </SizedGenericModal>
    );
};

export default WikiDocViewModal;
