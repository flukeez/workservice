import { ActionIcon, Group, Input, TextInput } from "@mantine/core";
import { IconSearch, IconCircleOff, IconX } from "@tabler/icons-react";

interface Props {
	label?: string
	value: string;
	placeholder: string;
	onChange: (e: any) => void;
	onSearchData: () => void;
	onClearSearch: () => void;
}

function InputSearch({ label, value, placeholder, onChange, onSearchData, onClearSearch, }: Props) {
	return (
		<Input.Wrapper label={label}>
			<TextInput
				leftSection={<IconSearch size={16} />}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				rightSection={
					<Group gap={3}>
						<ActionIcon variant="light" color="blue" onClick={onSearchData}>
							<IconSearch size={18} />
						</ActionIcon>

						<ActionIcon variant="light" color="gray" onClick={onClearSearch}>
							<IconX size={18} />
						</ActionIcon>
					</Group>
				}
				rightSectionWidth={70}
				data-autofocus
			/>
		</Input.Wrapper>
	);
}

export default InputSearch;
