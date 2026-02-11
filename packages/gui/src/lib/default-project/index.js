import projectData from './project-data';

 
import overrideDefaultProject from './override-default-project.sb3?bytes';
import backdrop from './cd21514d0531fdffb22204e0ec5ed84a.svg?raw';
import costume1 from './applecat.svg?raw';
 
const defaultProject = translator => {
    if (overrideDefaultProject.byteLength > 0) {
        return [
            {
                id: 0,
                assetType: 'Project',
                dataFormat: 'JSON',
                data: overrideDefaultProject
            }
        ];
    }

    const encoder = new TextEncoder();

    const projectJson = projectData(translator);
    return [
        {
            id: 0,
            assetType: 'Project',
            dataFormat: 'JSON',
            data: JSON.stringify(projectJson)
        },
        {
            id: 'cd21514d0531fdffb22204e0ec5ed84a',
            assetType: 'ImageVector',
            dataFormat: 'SVG',
            data: encoder.encode(backdrop)
        },
        {
            id: '1fe66020da00ba6c793c45d652e6b9cd',
            assetType: 'ImageVector',
            dataFormat: 'SVG',
            data: encoder.encode(costume1)
        }
    ];
};

export default defaultProject;
