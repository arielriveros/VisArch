import ListItem, { ListItemProps } from '../listItem/ListItem';

interface ListProps {
    items: ListItemProps[];
}

export default function List(props: ListProps): JSX.Element {
    return (
        <div className="list">
            {
                props.items.map(
                    (item: ListItemProps) => (
                        <ListItem
                            key={item.text} /* TODO: Change for a proper key */
                            text={item.text}
                            onClick={item.onClick}
                        />
                    )
                )
            }
        </div>
    );
}
