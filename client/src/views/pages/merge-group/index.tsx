import {
	Box,
	Button,
	Checkbox,
	HStack,
	SkeletonText,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { MdDelete, MdGroupAdd, MdGroups3 } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { popFromNavbar, pushToNavbar } from '../../../hooks/useNavbar';
import { useTheme } from '../../../hooks/useTheme';
import GroupService from '../../../services/group.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addSelectedGroup,
	deleteMergedGroup,
	removeSelectedGroup,
	setIsDeleting,
	setIsFetching,
	setMergedGroupList,
} from '../../../store/reducers/MergeGroupReducer';
import ConfirmationDialog, { ConfirmationDialogHandle } from '../../components/confirmation-alert';
import GroupMerge from './components/group-merge-dialog';

const GroupAndLabelPage = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	const theme = useTheme();

	const dispatch = useDispatch();
	const {
		list,
		selectedGroups,
		uiDetails: { isFetching, isDeleting },
	} = useSelector((state: StoreState) => state[StoreNames.MERGE_GROUP]);

	const deleteGroup = () => {
		dispatch(setIsDeleting(true));
		selectedGroups.forEach(async (id) => {
			GroupService.deleteMerged(id).then((res) => {
				if (!res) {
					return;
				}
				dispatch(deleteMergedGroup(id));
			});
		});
	};

	useEffect(() => {
		pushToNavbar({
			title: 'Group Merge',
			icon: MdGroups3,
			actions: (
				<HStack>
					<Button
						leftIcon={<MdDelete />}
						colorScheme={'red'}
						size={'sm'}
						isLoading={isDeleting}
						isDisabled={selectedGroups.length === 0}
						onClick={() => confirmationDialogRef.current?.open()}
					>
						Delete Groups
					</Button>
					<Button leftIcon={<MdGroupAdd />} size={'sm'} colorScheme='blue' onClick={onOpen}>
						Merge Group
					</Button>
				</HStack>
			),
		});
		return () => {
			popFromNavbar();
		};
	}, [onOpen, selectedGroups.length, isDeleting]);

	useEffect(() => {
		dispatch(setIsFetching(true));
		GroupService.mergedGroups()
			.then((groups) => dispatch(setMergedGroupList(groups)))
			.finally(() => dispatch(setIsFetching(false)));
	}, [dispatch]);

	return (
		<Box>
			<TableContainer>
				<Table>
					<Thead>
						<Tr>
							<Th width={'5%'}>sl no</Th>
							<Th width={'75%'}>Group Name</Th>
							<Th width={'20%'} isNumeric>
								No of Whatsapp Groups
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isFetching && list.length === 0 ? (
							<Tr color={theme === 'dark' ? 'white' : 'black'}>
								<Td>
									<LineSkeleton />
								</Td>

								<Td>
									<LineSkeleton />
								</Td>

								<Td>
									<LineSkeleton />
								</Td>
							</Tr>
						) : (
							list.map((group, index) => {
								return (
									<Tr key={index} cursor={'pointer'} color={theme === 'dark' ? 'white' : 'black'}>
										<Td>
											<Checkbox
												mr={'1rem'}
												isChecked={selectedGroups.includes(group.id)}
												onChange={(e) => {
													if (e.target.checked) {
														dispatch(addSelectedGroup(group.id));
													} else {
														dispatch(removeSelectedGroup(group.id));
													}
												}}
												colorScheme='green'
											/>
											{index + 1}.
										</Td>
										<Td>{group.name}</Td>
										<Td isNumeric>{group.groups.length}</Td>
									</Tr>
								);
							})
						)}
					</Tbody>
				</Table>
			</TableContainer>
			<GroupMerge isOpen={isOpen} onClose={onClose} />
			<ConfirmationDialog
				ref={confirmationDialogRef}
				onConfirm={deleteGroup}
				type={'Merged Groups'}
			/>
		</Box>
	);
};

function LineSkeleton() {
	return <SkeletonText mt='4' noOfLines={1} spacing='4' skeletonHeight='4' rounded={'md'} />;
}

export default GroupAndLabelPage;